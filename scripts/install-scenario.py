#!/usr/bin/env python3
"""Install one clean scenario into an existing CloudGoat installation."""
import argparse
import pathlib
import re
import shutil
import subprocess
import sys


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("platform", choices=("aws", "azure"))
    parser.add_argument("scenario")
    parser.add_argument("--cloudgoat-root", type=pathlib.Path,
                        help="Package directory containing scenarios/, not the repository root")
    args = parser.parse_args()
    if not re.fullmatch(r"[a-z0-9_]+", args.scenario):
        parser.error("Invalid scenario name")
    source = pathlib.Path(__file__).resolve().parents[1] / "scenarios" / args.platform / args.scenario
    if not (source / "manifest.yml").is_file():
        parser.error("Scenario is not available in this repository")
    root = args.cloudgoat_root
    if root is None:
        entry = shutil.which("cloudgoat")
        if not entry:
            parser.error("Install CloudGoat with pipx and open a new terminal first")
        interpreter = pathlib.Path(entry).resolve().parent / "python"
        if not interpreter.exists():
            parser.error("Use --cloudgoat-root for a non-pipx installation")
        result = subprocess.run([str(interpreter), "-c",
                                 "import pathlib,cloudgoat; print(pathlib.Path(cloudgoat.__file__).resolve().parent)"],
                                check=True, text=True, capture_output=True)
        root = pathlib.Path(result.stdout.strip())
    root = root.resolve()
    if not (root / "scenarios" / args.platform).is_dir():
        parser.error("CloudGoat platform directory was not found")
    target = root / "scenarios" / args.platform / args.scenario
    if target.exists():
        parser.error("Destination already exists; preserved without overwriting: " + str(target))
    shutil.copytree(source, target, ignore=shutil.ignore_patterns(
        ".terraform", ".terraform.lock.hcl", "*.tfstate*", "*.tfplan", "*.log",
        "cloudgoat", "cloudgoat.pub", "start.txt", "config.yml", "whitelist.txt"))
    for file in target.rglob("*"):
        if file.is_file() and file.suffix in (".sh", ".tf", ".yml", ".md", ".com"):
            file.write_bytes(file.read_bytes().replace(b"\r\n", b"\n"))
    (target / "start.sh").chmod(0o755)
    print("Installed: " + str(target))
    print("No cloud resources were created.")


if __name__ == "__main__":
    main()

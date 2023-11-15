"""
This module automates running unit tests by:
- checking if pytest and coverage installed
- installing them if not already installed
- running the tests with coverage
- creating an HTML coverage report
"""


import pkg_resources
from sys import executable
from subprocess import check_call


def main():
    python = executable

    # Check if there are missing packages.
    required_packages = {"pytest", "coverage", "requests"}
    installed_packages = {pkg.key for pkg in pkg_resources.working_set}
    missing = required_packages - installed_packages

    # Install missing packages if any.
    if missing:
        check_call([python, "-m", "pip", "install", *missing])

    # Run tests with coverage and pytest.
    check_call([python, "-m", "coverage", "run", "-m", "pytest", "-s", "../tests"])

    # Generate coverage report in both HTML (for humans) and XML (for CI).
    check_call([python, "-m", "coverage", "html"])
    check_call([python, "-m", "coverage", "xml"])


if __name__ == "__main__":
    main()

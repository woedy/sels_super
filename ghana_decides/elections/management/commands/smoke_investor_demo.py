from __future__ import annotations

from django.conf import settings
from django.core.management import CommandError
from django.core.management.base import BaseCommand
from django.test.utils import get_runner


class Command(BaseCommand):
    help = "Run the investor demo smoke suite (ingestion, websockets, and map)."

    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING("Running investor demo smoke tests…"))
        test_labels = [
            'elections.tests.test_submission_api',
            'elections.tests.test_public_map',
            'elections.tests.test_presenter_realtime',
        ]
        TestRunner = get_runner(settings)
        test_runner = TestRunner(verbosity=1, interactive=False)
        failures = test_runner.run_tests(test_labels)
        if failures:
            raise CommandError(f"Smoke suite failed ({failures} modules).")
        self.stdout.write(self.style.SUCCESS("Smoke suite passed."))

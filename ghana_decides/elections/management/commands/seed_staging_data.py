from __future__ import annotations

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction

from candidates.models import ParliamentaryCandidate, Party, PresidentialCandidate
from elections.models import (
    Election,
    ElectionParliamentaryCandidate,
    ElectionPresidentialCandidate,
)
from regions.models import (
    Constituency,
    ElectoralArea,
    PollingStation,
    PollingStationAssignment,
    Region,
)
from user_profile.models import UserProfile


class Command(BaseCommand):
    help = "Seed a minimal but complete dataset for staging demonstrations."

    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING("Seeding staging data…"))
        with transaction.atomic():
            region = self._get_or_create_region()
            constituency = self._get_or_create_constituency(region)
            electoral_area = self._get_or_create_electoral_area(constituency)
            polling_station = self._get_or_create_polling_station(electoral_area)
            election = self._get_or_create_election()
            party = self._get_or_create_party()
            pres_candidate = self._get_or_create_presidential_candidate(party)
            parl_candidate = self._get_or_create_parliamentary_candidate(party, constituency)
            self._register_election_candidates(election, pres_candidate, parl_candidate)
            accounts = self._ensure_demo_accounts(polling_station, election)

        self.stdout.write(self.style.SUCCESS("Staging dataset ready."))
        for label, account in accounts.items():
            self.stdout.write(f"  {label}: {account.email} / changeme123")

    # --- Geography helpers -------------------------------------------------

    def _get_or_create_region(self):
        region, _ = Region.objects.get_or_create(
            region_name="Greater Accra",
            defaults={"election_year": "2024"},
        )
        return region

    def _get_or_create_constituency(self, region: Region):
        constituency, _ = Constituency.objects.get_or_create(
            region=region,
            constituency_name="Ayawaso Central",
            defaults={"election_year": region.election_year},
        )
        return constituency

    def _get_or_create_electoral_area(self, constituency: Constituency):
        electoral_area, _ = ElectoralArea.objects.get_or_create(
            constituency=constituency,
            electoral_area_name="Nima",
            defaults={"election_year": constituency.election_year},
        )
        return electoral_area

    def _get_or_create_polling_station(self, electoral_area: ElectoralArea):
        polling_station, _ = PollingStation.objects.get_or_create(
            electoral_area=electoral_area,
            polling_station_name="Nima Cluster of Schools",
            defaults={"election_year": electoral_area.election_year},
        )
        return polling_station

    # --- Election helpers --------------------------------------------------

    def _get_or_create_election(self) -> Election:
        election, _ = Election.objects.get_or_create(year="2024")
        return election

    def _get_or_create_party(self) -> Party:
        party, _ = Party.objects.get_or_create(
            party_initial="SP",
            defaults={
                "party_full_name": "Sunrise Party",
                "party_color": "#ffbf00",
            },
        )
        return party

    def _get_or_create_presidential_candidate(self, party: Party) -> PresidentialCandidate:
        candidate, _ = PresidentialCandidate.objects.get_or_create(
            party=party,
            first_name="Ama",
            last_name="Mensah",
            defaults={"gender": "Female"},
        )
        return candidate

    def _get_or_create_parliamentary_candidate(
        self, party: Party, constituency: Constituency
    ) -> ParliamentaryCandidate:
        candidate, _ = ParliamentaryCandidate.objects.get_or_create(
            party=party,
            constituency=constituency,
            first_name="Kwesi",
            last_name="Boateng",
            defaults={"gender": "Male"},
        )
        return candidate

    def _register_election_candidates(
        self,
        election: Election,
        pres_candidate: PresidentialCandidate,
        parl_candidate: ParliamentaryCandidate,
    ) -> None:
        ElectionPresidentialCandidate.objects.get_or_create(
            election=election,
            candidate=pres_candidate,
            defaults={"ballot_number": 1},
        )
        ElectionParliamentaryCandidate.objects.get_or_create(
            election=election,
            candidate=parl_candidate,
            defaults={"ballot_number": 1},
        )

    # --- Accounts ----------------------------------------------------------

    def _ensure_demo_accounts(self, polling_station: PollingStation, election: Election):
        User = get_user_model()
        accounts = {}
        accounts["Data admin"] = self._get_or_create_user(
            User,
            email="data.admin@sels-demo.local",
            first_name="Dora",
            last_name="Admin",
            user_type="Data Admin",
        )
        accounts["Presenter"] = self._get_or_create_user(
            User,
            email="presenter@sels-demo.local",
            first_name="Peter",
            last_name="Presenter",
            user_type="Presenter",
        )
        accounts["Correspondent"] = self._get_or_create_user(
            User,
            email="correspondent@sels-demo.local",
            first_name="Cora",
            last_name="Field",
            user_type="Correspondent",
        )

        for account in accounts.values():
            account.email_verified = True
            account.staff = True
            account.save(update_fields=["email_verified", "staff"])
            UserProfile.objects.get_or_create(
                user=account,
                defaults={
                    "phone": "+233200000000",
                    "country": "Ghana",
                    "active": True,
                },
            )

        PollingStationAssignment.objects.get_or_create(
            polling_station=polling_station,
            user=accounts["Correspondent"],
            defaults={"role": "correspondent"},
        )
        PollingStationAssignment.objects.get_or_create(
            polling_station=polling_station,
            user=accounts["Data admin"],
            defaults={"role": "data_admin"},
        )
        return accounts

    def _get_or_create_user(self, User, email, first_name, last_name, user_type):
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "first_name": first_name,
                "last_name": last_name,
                "user_type": user_type,
            },
        )
        if created:
            user.set_password("changeme123")
            user.user_type = user_type
            user.save()
        elif user.user_type != user_type:
            user.user_type = user_type
            user.save(update_fields=["user_type"])
        return user

"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""

from django.test import TestCase
from popit.models import Organisation, OrganisationName

class OrganisationTest(TestCase):
    def test_naming(self):
        """
        Test that the correct name is used to set the slug
        """

        org = Organisation()
        org.save()
        self.assertEqual( org.name, "Unknown" )
        
        # create a name, should be used for org.
        foo_inc_name = org.names.create(
            organisation = org,
            name = "Foo Inc",
        )
        self.assertEqual( org.name, "Foo Inc" )
        self.assertEqual( org.slug, "foo-inc" )
        self.assertEqual( foo_inc_name.main, True )

        # Add another name, that is not main
        bar_inc_name = org.names.create(
            organisation = org,
            name = "Bar Inc",
        )
        self.assertEqual( org.name, "Foo Inc" )
        self.assertEqual( org.slug, "foo-inc" )
        self.assertEqual( foo_inc_name.main, True )
        self.assertEqual( bar_inc_name.main, False )
        
        # change bar to be main, check that org is updated
        bar_inc_name.main = True
        bar_inc_name.save()
        foo_inc_name = foo_inc_name.fetch_fresh_from_database()
        self.assertEqual( org.name, "Bar Inc" )
        self.assertEqual( org.slug, "bar-inc" )
        self.assertEqual( foo_inc_name.main, False )
        self.assertEqual( bar_inc_name.main, True )
        
        # change foo back to be the main
        foo_inc_name.main = True
        foo_inc_name.save()
        bar_inc_name = bar_inc_name.fetch_fresh_from_database()
        org = org.fetch_fresh_from_database()
        self.assertEqual( org.name, "Foo Inc" )
        self.assertEqual( org.slug, "foo-inc" )
        self.assertEqual( foo_inc_name.main, True )
        self.assertEqual( bar_inc_name.main, False )

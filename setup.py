# TODO
# 1) Dependencies.
# 2) Provides.

from distutils.core import setup

setup(
    name='PopIt',
    packages=[
        'popit',
        'popit.models',
        'popit.migrations',
        ],
    package_data={'popit': ['templates/popit/*.html']},
    version='0.1dev',
    author='mySociety',
    author_email='team@theyworkforyou.com',
    url='https://github.com/mysociety/popit',
    license='LICENSE.txt',
    description='A web services for storing info about people.',
    long_description=open('README.txt').read(),
    classifiers=[
        'Development Status :: 2 - Pre-Alpha',
        'Environment :: Web Environment',
        'Framework :: Django',
        'License :: OSI Approved :: GNU Affero General Public License v3',
        'Intended Audience :: Developers', # FIXME - add more?
        'Programming Language :: Python',
        'Programming Language :: Python :: 2.5', # FIXME - check version
        'Topic :: Internet :: WWW/HTTP',  # FIXME - more topics?
        ],
#    install_requires = [],
)

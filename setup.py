#!/usr/bin/env python
# coding: utf-8

from setuptools import setup

setup(
    name="app",
    version='0.1',
    description='app.',
    author='Andrés M. R. Martano',
    author_email='andres@inventati.org',
    url='https://github.com/andresmrm/promise-tracker-app',
    packages=["tracker"],
    install_requires=['Flask>=0.7.2', 'MarkupSafe'],
    keywords=[],
    classifiers=[]
)

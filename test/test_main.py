import test_join_leave
import test_webinar
from test_deployment import TestDeployment
from test_join_leave import TestJoinLeave


import unittest
import sys
import os
import random

os.environ['SERVER_URL'] = sys.argv[1]
os.environ['AMS_USER'] = sys.argv[2]
os.environ['AMS_PASSWORD'] = sys.argv[3]
os.environ['WAR_FILE'] = sys.argv[4]
use_test_webinar = sys.argv[5].lower() == 'true'
os.environ['TEST_APP_NAME'] = "TestAPP"+str(random.randint(100, 999))

suite = unittest.TestSuite()
suite.addTest(TestDeployment('test_install_app'))

'''
suite2 = None
if use_test_webinar:
    suite2 = unittest.TestLoader().loadTestsFromModule(test_webinar)
else:
    suite2 = unittest.TestLoader().loadTestsFromModule(test_join_leave)

    suite.addTests(suite2)
'''
suite.addTest(TestJoinLeave("test_join_with_2_virtual_camera")) 

suite.addTest(TestDeployment('test_delete_app'))

ret = not unittest.TextTestRunner(verbosity=2, failfast=True).run(suite).wasSuccessful()
sys.exit(ret)

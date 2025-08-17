# -*- coding: utf-8 -*-

import os
import signal

from . import controllers
from . import models
from . import worker

from . import freeswitch

def post_load():
    worker.worker()
    return



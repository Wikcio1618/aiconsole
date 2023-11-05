# The AIConsole Project
#
# Copyright 2023 10Clouds
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import os
from pathlib import Path
from aiconsole.chats.list_possible_historic_chat_ids import list_possible_historic_chat_ids
from aiconsole.chats.load_chat_history import load_chat_history
from appdirs import user_config_dir
from aiconsole.consts import MAX_RECENT_PROJECTS
from aiconsole.recent_projects.recent_project import RecentProject


def _get_user_recent_projects_file():
    return Path(user_config_dir('aiconsole')) / "recent"

def _read_recent_projects():
    recent_projects_file = _get_user_recent_projects_file()
    if recent_projects_file.exists():
        recent_projects = recent_projects_file.read_text().splitlines()
    else:
        recent_projects = []

    return recent_projects


async def add_to_recent_projects(project_path: str):
    # read from file
    recent_projects = _read_recent_projects()
    recent_projects.insert(0, project_path)

    # only unique but keep order
    recent_projects = list(dict.fromkeys(recent_projects))

    # limit to MAX_RECENT_PROJECTS
    if len(recent_projects) > MAX_RECENT_PROJECTS:
        recent_projects = recent_projects[:MAX_RECENT_PROJECTS]

    # save to file
    recent_projects_file = _get_user_recent_projects_file()
    recent_projects_file.parent.mkdir(parents=True, exist_ok=True)
    recent_projects_file.write_text("\n".join(recent_projects))



async def get_recent_project():
    # read from file
    recent_projects = _read_recent_projects()

    return [RecentProject(name=
        os.path.basename(path),
        path=path,
        recent_chats=[load_chat_history(id, path).title for id in list_possible_historic_chat_ids(path)[:4]]
    ).model_dump() for path in recent_projects]
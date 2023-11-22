from enum import Enum

from aiconsole.api.websockets.outgoing_messages import BaseWSMessage


class SequenceStage(str, Enum):
    START = "start"
    MIDDLE = "middle"
    END = "end"


class UpdateAnalysisWSMessage(BaseWSMessage):
    stage: SequenceStage
    analysis_request_id: str
    agent_id: str | None = None
    relevant_material_ids: list[str] | None = None
    next_step: str | None = None
    thinking_process: str | None = None


class UpdateMessageWSMessage(BaseWSMessage):
    id: str
    stage: SequenceStage

    text_delta: str | None = None


class ResetMessageWSMessage(BaseWSMessage):
    id: str


class UpdateToolCallWSMessage(BaseWSMessage):
    id: str
    stage: SequenceStage

    language: str | None = None

    code_delta: str | None = None
    headline_delta: str | None = None


class UpdateToolCallOutputWSMessage(BaseWSMessage):
    id: str
    stage: SequenceStage
    output_delta: str | None = None
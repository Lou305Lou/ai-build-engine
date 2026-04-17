from typing import Dict, Any
from pydantic import BaseModel

class HyperSystemReport(BaseModel):
    report: Dict[str, Any]
    summary: str

class HyperSystemReportEngine:
    async def generate(self, hyper_master: Dict[str, Any]) -> HyperSystemReport:
        summary = f"Hyper System Status: {hyper_master.get('label', 'unknown')} (score={hyper_master.get('final_score', 0.0):.2f})"

        return HyperSystemReport(
            report=hyper_master,
            summary=summary
        )

hyper_system_report_engine = HyperSystemReportEngine()

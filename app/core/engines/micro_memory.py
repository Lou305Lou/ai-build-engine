from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, List, Optional


@dataclass
class MemoryItem:
    key: str
    value: Any
    tags: List[str]


class MicroMemoryEngine:
    """
    Simple in-process memory:
    - Key/value store with tags
    - Not persistent (per-process only)
    """

    def __init__(self) -> None:
        self._items: Dict[str, MemoryItem] = {}

    def set(self, key: str, value: Any, tags: Optional[List[str]] = None) -> None:
        self._items[key] = MemoryItem(key=key, value=value, tags=tags or [])

    def get(self, key: str) -> Optional[Any]:
        item = self._items.get(key)
        return item.value if item else None

    def get_item(self, key: str) -> Optional[MemoryItem]:
        return self._items.get(key)

    def delete(self, key: str) -> None:
        self._items.pop(key, None)

    def search_by_tag(self, tag: str) -> List[MemoryItem]:
        return [item for item in self._items.values() if tag in item.tags]

    def all(self) -> List[MemoryItem]:
        return list(self._items.values())

# Guided tutorial

This language introduction is supplemental to the Study overview and is selected through ?. Its three distinct targets explain language selection, activity navigation and available modules without changing pages. Explore and Flashcards guides belong to their current host views.

## Usage Examples

On the Study overview, use the language navigation to choose learning materials and the activity navigation to find Explore or Flashcards. This supplementary guide describes those controls without moving you between pages. Each activity provides its own contextual walkthrough.

## Technical Specification

The shared host provides queued floating actions. First visits offer Next/Finish without Cancel or Skip; replays offer Skip before the last visible step. Restart Tutorial appears after the first visible step. Completion survives content updates. Explicit highlightNext flags enable only a breathing animation for explanatory steps; reduced motion disables it. Each stage highlights a distinct rendered control in UI order. Guides stay bound to the current view, handle empty and optional states, and release their resources on navigation or owner removal.

Language guides are available only after explicit enrollment in Study settings. The redundant enrollment introduction is removed; the guide begins with Explore and continues to practice tools.

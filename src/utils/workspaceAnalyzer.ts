//workspaceAnalyzer.ts
import type { WorkspaceObject } from '../types/workspace';

export interface WorkspaceAnalysis {
  workspaceScore: number;
  ergonomicScore: number;
  comfortScore: number;
  suggestions: string[];
}

export interface DeskBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

const isFullyInside = (obj: WorkspaceObject, container: DeskBounds) => {
  return (
    obj.x >= container.x &&
    obj.y >= container.y &&
    obj.x + obj.width <= container.x + container.width &&
    obj.y + obj.height <= container.y + container.height
  );
};

const intersects = (a: WorkspaceObject, b: WorkspaceObject) => {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
};

const getCenterX = (obj: { x: number; width: number }) => obj.x + obj.width / 2;

export function analyzeWorkspace(objects: WorkspaceObject[], desk: DeskBounds): WorkspaceAnalysis {
  let workspaceScore = 100;
  let ergonomicScore = 100;
  let comfortScore = 100;
  const suggestions: string[] = [];

  const monitor = objects.find((obj) => obj.type.toLowerCase() === 'monitor');
  const keyboard = objects.find((obj) => obj.type.toLowerCase() === 'keyboard');
  const mouse = objects.find((obj) => obj.type.toLowerCase() === 'mouse');
  const chair = objects.find((obj) => obj.type.toLowerCase() === 'chair');
  const laptop = objects.find((obj) => obj.type.toLowerCase() === 'laptop');

  if (monitor && !isFullyInside(monitor, desk)) {
    workspaceScore -= 20;
    suggestions.push('Move the monitor onto the desk.');
  }

  if (keyboard && !isFullyInside(keyboard, desk)) {
    ergonomicScore -= 15;
    suggestions.push('Move the keyboard onto the desk.');
  }

  if (keyboard && mouse && intersects(keyboard, mouse)) {
    comfortScore -= 10;
    suggestions.push('Separate the mouse from the keyboard.');
  }

  if (chair) {
    const deskCenterX = desk.x + desk.width / 2;
    const chairCenterX = getCenterX(chair);
    const allowedOffset = desk.width * 0.1;

    if (Math.abs(chairCenterX - deskCenterX) > allowedOffset) {
      comfortScore -= 10;
      suggestions.push('Center the chair with the desk.');
    }
  }

  if (monitor && chair) {
    const monitorCenterX = getCenterX(monitor);
    const chairCenterX = getCenterX(chair);

    if (Math.abs(monitorCenterX - chairCenterX) > 80) {
      ergonomicScore -= 10;
      suggestions.push('Center the monitor with the chair.');
    }
  }

  if (monitor && keyboard) {
    if (keyboard.y < monitor.y) {
      ergonomicScore -= 10;
      suggestions.push('Place the keyboard below the monitor.');
    }
  }

  if (keyboard && mouse) {
    const horizontalGap =
      keyboard.x + keyboard.width < mouse.x
        ? mouse.x - (keyboard.x + keyboard.width)
        : mouse.x + mouse.width < keyboard.x
          ? keyboard.x - (mouse.x + mouse.width)
          : 0;

    const verticalGap =
      keyboard.y + keyboard.height < mouse.y
        ? mouse.y - (keyboard.y + keyboard.height)
        : mouse.y + mouse.height < keyboard.y
          ? keyboard.y - (mouse.y + mouse.height)
          : 0;

    const distance = horizontalGap === 0 || verticalGap === 0 ? Math.max(horizontalGap, verticalGap) : Math.sqrt(horizontalGap ** 2 + verticalGap ** 2);

    if (distance > 40) {
      comfortScore -= 10;
      suggestions.push('Move the mouse closer to the keyboard.');
    }
  }

  if (laptop && monitor && intersects(laptop, monitor)) {
    workspaceScore -= 10;
    suggestions.push('Separate the laptop from the monitor.');
  }

  return {
    workspaceScore,
    ergonomicScore,
    comfortScore,
    suggestions,
  };
}

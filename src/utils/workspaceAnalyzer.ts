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

  return {
    workspaceScore,
    ergonomicScore,
    comfortScore,
    suggestions,
  };
}

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
  
  // ใช้ Set ป้องกันข้อความแจ้งเตือนซ้ำซ้อน
  const suggestionsSet = new Set<string>();
  const pushSuggestion = (msg: string) => suggestionsSet.add(msg);

  const monitor = objects.find((obj) => obj.type === 'Monitor');
  const laptop = objects.find((obj) => obj.type === 'Laptop');
  const keyboard = objects.find((obj) => obj.type === 'Keyboard');
  const mouse = objects.find((obj) => obj.type === 'Mouse');
  const chair = objects.find((obj) => obj.type === 'Chair');
  const lamp = objects.find((obj) => obj.type === 'Desk Lamp');
  const speaker = objects.find((obj) => obj.type === 'Speaker');

  // ==========================================
  // 1. Boundary & Overlap (Workspace Score)
  // ==========================================
  
  if (monitor && !isFullyInside(monitor, desk)) {
    workspaceScore -= 20;
    pushSuggestion('Move the monitor onto the desk to prevent damage.');
  }
  
  if (keyboard && !isFullyInside(keyboard, desk)) {
    ergonomicScore -= 15;
    pushSuggestion('Move the keyboard onto the desk to fully support your arms.');
  }

  // วัตถุทางกายภาพห้ามซ้อนทับกัน (ยกเว้นเก้าอี้)
  const deskObjects = objects.filter(obj => obj.type !== 'Chair');
  for (let i = 0; i < deskObjects.length; i++) {
    for (let j = i + 1; j < deskObjects.length; j++) {
      if (intersects(deskObjects[i], deskObjects[j])) {
        const typeA = deskObjects[i].type;
        const typeB = deskObjects[j].type;
        workspaceScore -= 10;
        pushSuggestion(`Separate the ${typeA} and ${typeB}. Physical objects cannot overlap.`);
      }
    }
  }

  // ==========================================
  // 2. Reach Zones (Workspace Score)
  // ==========================================
  
  // โซนเอื้อมถึงทันที (Primary Zone: 40 cm จากขอบโต๊ะด้านหน้า)
  // อุปกรณ์ที่ไม่ใช่อินพุต เช่น ลำโพง โคมไฟ ไม่ควรมาเกะกะในโซนนี้
  const primaryZoneY = desk.height - 40;
  [lamp, speaker].forEach(acc => {
    if (acc && acc.y + acc.height > primaryZoneY) {
      workspaceScore -= 10;
      pushSuggestion(`Move the ${acc.type} further back. It's blocking your primary reach zone.`);
    }
  });

  // ==========================================
  // 3. Posture & Alignment (Ergonomic & Comfort)
  // ==========================================

  if (chair) {
    const deskCenterX = desk.x + desk.width / 2;
    if (Math.abs(getCenterX(chair) - deskCenterX) > desk.width * 0.1) {
      comfortScore -= 10;
      pushSuggestion('Center the chair with the desk for overall spatial balance.');
    }
  }

  // แนวเรียงตัวของ เก้าอี้-คีย์บอร์ด
  if (chair && keyboard) {
    const misalignment = Math.abs(getCenterX(chair) - getCenterX(keyboard));
    if (misalignment > 30) {
      ergonomicScore -= 15;
      pushSuggestion('Align the chair with the keyboard to prevent severe spine twisting.');
    } else if (misalignment > 15) {
      comfortScore -= 10;
      pushSuggestion('Slightly adjust your chair to center it with the keyboard.');
    }
  }

  // แนวเรียงตัวของ เก้าอี้-หน้าจอ
  if (chair && monitor) {
    const misalignment = Math.abs(getCenterX(chair) - getCenterX(monitor));
    if (misalignment > 30) {
      ergonomicScore -= 15;
      pushSuggestion('Center the monitor with your chair to prevent neck strain.');
    } else if (misalignment > 15) {
      comfortScore -= 10;
      pushSuggestion('Adjust the monitor so it sits directly in front of you.');
    }
  }

  // ==========================================
  // 4. Distances & Clearances (Ergonomic Score)
  // ==========================================

  // Wrist Rest Zone: ต้องมีพื้นที่พักข้อมือหน้าคีย์บอร์ดอย่างน้อย 15 cm
  if (keyboard) {
    const keyboardBottom = keyboard.y + keyboard.height;
    if (desk.height - keyboardBottom < 15) {
      ergonomicScore -= 15;
      pushSuggestion('Leave at least 15cm of space in front of the keyboard to rest your wrists.');
    }
  }

  // Mouse Reach: ป้องกัน Mouse Shoulder โดยบังคับให้อยู่ใกล้คีย์บอร์ด
  if (keyboard && mouse) {
    const horizontalGap =
      keyboard.x + keyboard.width < mouse.x ? mouse.x - (keyboard.x + keyboard.width) :
      mouse.x + mouse.width < keyboard.x ? keyboard.x - (mouse.x + mouse.width) : 0;
    const verticalGap =
      keyboard.y + keyboard.height < mouse.y ? mouse.y - (keyboard.y + keyboard.height) :
      mouse.y + mouse.height < keyboard.y ? keyboard.y - (mouse.y + mouse.height) : 0;

    const distance = horizontalGap === 0 || verticalGap === 0 
      ? Math.max(horizontalGap, verticalGap) 
      : Math.sqrt(horizontalGap ** 2 + verticalGap ** 2);

    if (distance > 15) {
      ergonomicScore -= 15; 
      pushSuggestion('Keep the mouse closer to the keyboard (within 15cm) to avoid shoulder strain.');
    }
  }

  // Viewing Distance: หาระยะห่างระหว่าง Monitor กับ Keyboard
  // Viewing Distance: วัดระยะจากตัวผู้ใช้ (ขอบโต๊ะด้านหน้า) ไปถึงหน้าจอ
  if (monitor) {
    // desk.height คือขอบโต๊ะฝั่งที่คนนั่ง
    // monitor.y + monitor.height คือตำแหน่งด้านหน้าของหน้าจอ
    const distanceFromUser = desk.height - (monitor.y + monitor.height);
    
    // ระยะสายตาควรห่างอย่างน้อย 50cm 
    // แต่ถ้าระยะห่างน้อยกว่า 50cm "และ" หน้าจอยังสามารถถอยหลังได้อีก (y > 5) ค่อยแจ้งเตือน
    if (distanceFromUser < 50 && monitor.y > 5) {
      ergonomicScore -= 15;
      pushSuggestion('Push the monitor further back to protect your eyes (aim for an arm\'s length).');
    }
    // หมายเหตุ: ถ้าโต๊ะแคบ ถอยจอจนติดขอบแล้ว (y <= 5) แต่ระยะยังไม่ถึง 50cm ระบบจะไม่หักคะแนน 
    // เพราะถือว่าจัดวางได้ดีที่สุดเท่าที่โต๊ะจะอำนวยแล้ว
  }

  // Dual Screen: ป้องกันการหันคอกว้างเกินไป
  if (monitor && laptop) {
    const gap = Math.abs(getCenterX(monitor) - getCenterX(laptop)) - (monitor.width / 2 + laptop.width / 2);
    if (gap > 30) {
      ergonomicScore -= 10;
      pushSuggestion('Bring the laptop and monitor closer together to reduce neck movement.');
    }
  }

  // ==========================================
  // 5. Lighting & Glare (Comfort Score)
  // ==========================================

  // โคมไฟไม่ควรอยู่ตำแหน่งที่ทำให้เกิดแสงแยงตาหรือสะท้อนจอภาพ
  if (lamp && monitor) {
    const lampCenter = getCenterX(lamp);
    if (lampCenter > monitor.x && lampCenter < monitor.x + monitor.width) {
      comfortScore -= 10;
      pushSuggestion('Move the lamp to the side. Placing it in line with the monitor causes screen glare.');
    }
  }

  // สรุปผลลัพธ์ (คุมไม่ให้ติดลบ)
  return {
    workspaceScore: Math.max(0, workspaceScore),
    ergonomicScore: Math.max(0, ergonomicScore),
    comfortScore: Math.max(0, comfortScore),
    suggestions: Array.from(suggestionsSet),
  };
}
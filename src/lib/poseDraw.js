const CONNECTIONS = [
  [11, 12],
  [11, 13],
  [13, 15],
  [12, 14],
  [14, 16],
  [11, 23],
  [12, 24],
  [23, 24],
  [23, 25],
  [25, 27],
  [27, 31],
  [24, 26],
  [26, 28],
  [28, 32],
];

export function drawSkeleton(canvas, landmarks) {
  if (!canvas) return;
  const context = canvas.getContext("2d");
  if (!context) return;
  const { width, height } = canvas;
  context.clearRect(0, 0, width, height);
  if (!landmarks?.length) return;

  const point = (index) => {
    const landmark = landmarks[index];
    if (!landmark) return null;
    return { x: landmark.x * width, y: landmark.y * height, visible: (landmark.visibility ?? 1) > 0.4 };
  };

  context.lineWidth = Math.max(3, width / 200);
  context.lineCap = "round";
  context.strokeStyle = "rgba(34, 240, 255, 0.92)";
  context.shadowColor = "rgba(34, 240, 255, 0.75)";
  context.shadowBlur = Math.max(8, width / 60);

  for (const [a, b] of CONNECTIONS) {
    const from = point(a);
    const to = point(b);
    if (!from?.visible || !to?.visible) continue;
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
  }

  context.shadowBlur = 0;
  context.fillStyle = "rgba(255, 255, 255, 0.95)";
  for (let index = 11; index < landmarks.length; index += 1) {
    const joint = point(index);
    if (!joint?.visible) continue;
    context.beginPath();
    context.arc(joint.x, joint.y, Math.max(2.5, width / 240), 0, Math.PI * 2);
    context.fill();
  }
}
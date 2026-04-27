export interface SortableTodo {
  _id: string;
  importancia: number; // 0–3: 0 = más importante (Crítica), 3 = Baja
  dificultad: number;  // 1–5
}

function buildPilas(tasks: SortableTodo[]): [SortableTodo[], SortableTodo[], SortableTodo[], SortableTodo[]] {
  return [
    tasks.filter(t => t.importancia === 0),
    tasks.filter(t => t.importancia === 1),
    tasks.filter(t => t.importancia === 2),
    tasks.filter(t => t.importancia === 3),
  ];
}

export function jumpingCat(tasks: SortableTodo[]): SortableTodo[] {
  const [p0, p1, p2, p3] = buildPilas(tasks).map(p => [...p]);
  const result: SortableTodo[] = [];
  const taken = new Set<string>();

  const take = (task: SortableTodo, pila: SortableTodo[]) => {
    result.push(task);
    taken.add(task._id);
    const idx = pila.indexOf(task);
    if (idx !== -1) pila.splice(idx, 1);
  };

  // 1. De pila0: primera tarea con dificultad < 3
  const t1 = [...p0].sort((a, b) => a.dificultad - b.dificultad).find(t => t.dificultad < 3);
  if (t1) take(t1, p0);

  // 2. De pila1: tarea con mayor dificultad
  if (p1.length > 0) {
    const t2 = [...p1].sort((a, b) => b.dificultad - a.dificultad)[0];
    take(t2, p1);
  }

  // 3. De todas las pilas: menor dificultad, desempate por importancia menor
  const remaining = [...p0, ...p1, ...p2, ...p3].filter(t => !taken.has(t._id));
  if (remaining.length > 0) {
    remaining.sort((a, b) => {
      if (a.dificultad !== b.dificultad) return a.dificultad - b.dificultad;
      return a.importancia - b.importancia;
    });
    const t3 = remaining[0];
    taken.add(t3._id);
    result.push(t3);
    const removeFrom = [p0, p1, p2, p3];
    for (const pila of removeFrom) {
      const idx = pila.findIndex(t => t._id === t3._id);
      if (idx !== -1) { pila.splice(idx, 1); break; }
    }
  }

  // 4. Resto en orden pila0 → pila1 → pila2 → pila3
  return [...result, ...p0, ...p1, ...p2, ...p3].filter(t => !taken.has(t._id) || result.includes(t));
}

export function pilaScore(tasks: SortableTodo[]): SortableTodo[] {
  if (tasks.length === 0) return [];

  // Rank by importance ascending (importancia 0 = most critical = rank 1)
  const sortedByImp = [...tasks].sort((a, b) => a.importancia - b.importancia || a._id.localeCompare(b._id));
  const impRank = new Map(sortedByImp.map((t, i) => [t._id, i + 1]));

  // Rank by difficulty descending (dificultad 5 = hardest = rank 1)
  const sortedByDif = [...tasks].sort((a, b) => b.dificultad - a.dificultad || a._id.localeCompare(b._id));
  const difRank = new Map(sortedByDif.map((t, i) => [t._id, i + 1]));

  return [...tasks].sort((a, b) => {
    const scoreA = (impRank.get(a._id) ?? tasks.length) + (difRank.get(a._id) ?? tasks.length);
    const scoreB = (impRank.get(b._id) ?? tasks.length) + (difRank.get(b._id) ?? tasks.length);
    if (scoreA !== scoreB) return scoreA - scoreB;
    return a.importancia - b.importancia;
  });
}

export function balancedFlow(tasks: SortableTodo[]): SortableTodo[] {
  const [p0, p1, p2, p3] = buildPilas(tasks).map(p => [...p]);
  const remaining: SortableTodo[] = [...p0, ...p1, ...p2, ...p3];
  const result: SortableTodo[] = [];
  let energia = 100;

  while (remaining.length > 0) {
    let candidates: SortableTodo[];

    if (energia > 70) {
      candidates = remaining.filter(t => t.importancia <= 1 && t.dificultad >= 3);
      if (candidates.length > 0) {
        candidates.sort((a, b) => a.importancia - b.importancia || b.dificultad - a.dificultad);
      } else {
        candidates = [...remaining].sort((a, b) => a.importancia - b.importancia);
      }
      const picked = candidates[0];
      result.push(picked);
      remaining.splice(remaining.indexOf(picked), 1);
      energia -= picked.dificultad * 8;
    } else if (energia >= 40) {
      candidates = remaining.filter(t => t.dificultad >= 2 && t.dificultad <= 4);
      if (candidates.length > 0) {
        candidates.sort((a, b) => a.importancia - b.importancia || a.dificultad - b.dificultad);
      } else {
        candidates = [...remaining].sort((a, b) => a.importancia - b.importancia);
      }
      const picked = candidates[0];
      result.push(picked);
      remaining.splice(remaining.indexOf(picked), 1);
      energia -= picked.dificultad * 5;
    } else {
      candidates = remaining.filter(t => t.dificultad <= 2);
      if (candidates.length > 0) {
        candidates.sort((a, b) => a.dificultad - b.dificultad || a.importancia - b.importancia);
      } else {
        candidates = [...remaining].sort((a, b) => a.dificultad - b.dificultad);
      }
      const picked = candidates[0];
      result.push(picked);
      remaining.splice(remaining.indexOf(picked), 1);
      energia -= picked.dificultad * 3;
      energia += 15;
    }

    energia = Math.max(0, Math.min(100, energia));
  }

  return result;
}

# Algoritmos de ordenación de to-dos

Los tres algoritmos reciben una lista de tareas con dos propiedades numéricas:

- `importancia`: 0–3 (0 = Crítica, 1 = Alta, 2 = Media, 3 = Baja)
- `dificultad`: 1–5 (5 = más difícil)

---

## JumpingCat

Aplica reglas manuales distintas para las primeras tres posiciones y vuelca el resto por bloques de importancia.

**Posición 1** — De las tareas críticas (importancia 0), elige la de menor dificultad (< 3). Victoria rápida para arrancar con energía.

**Posición 2** — De las tareas altas (importancia 1), elige la de mayor dificultad. Aprovecha el pico inicial.

**Posición 3** — De todo lo restante, la de menor dificultad global. Desempate por importancia.

**Resto** — Se vuelca en bloque: primero críticas, luego altas, medias y bajas, en el orden en que estaban.

**Cuándo usarlo:** cuando quieres empezar con una tarea manejable, afrontar un desafío mientras tienes energía, y no te importa que el resto no esté finamente ordenado.

---

## BalancedFlow

Simula un nivel de energía (empieza en 100) que baja al hacer tareas difíciles y sube al hacer tareas fáciles. El algoritmo elige la siguiente tarea según cuánta energía queda.

| Energía | Estrategia | Coste |
|---------|-----------|-------|
| > 70 | Tareas importantes y difíciles (importancia ≤ 1, dificultad ≥ 3) | `dificultad × 8` |
| 40 – 70 | Tareas de dificultad media (2–4), priorizando importancia | `dificultad × 5` |
| < 40 | Tareas fáciles (dificultad ≤ 2), priorizando la más fácil | `dificultad × 3`, recupera +15 |

La energía se mantiene siempre entre 0 y 100.

**Resultado:** el orden ondula — rachas de tareas exigentes seguidas de tareas de recuperación. No maximiza importancia pura, sino la sostenibilidad del flujo de trabajo.

**Cuándo usarlo:** sesiones largas donde el agotamiento importa y quieres un ritmo que no te queme.

**Base psicológica:**

- **Agotamiento cognitivo** — Baumeister, R. F., Bratslavsky, E., Muraven, M., & Tice, D. M. (1998). Ego depletion: Is the active self a limited resource? *Journal of Personality and Social Psychology*, 74(5), 1252–1265. El autocontrol y el esfuerzo mental consumen un recurso limitado que se agota con el uso continuado — de ahí que el coste energético aumente con la dificultad y que las tareas fáciles permitan recuperación.

- **Estado de flujo** — Csikszentmihalyi, M. (1990). *Flow: The Psychology of Optimal Experience*. Harper & Row. El rendimiento óptimo ocurre cuando la dificultad de la tarea se alinea con el nivel de capacidad disponible: demasiado fácil genera aburrimiento, demasiado difícil genera ansiedad. BalancedFlow reproduce este equilibrio dinámico ajustando la dificultad de las tareas seleccionadas al nivel de energía restante.

---

## PilaScore

Asigna un score numérico a cada tarea sumando dos rankings independientes:

1. **Rank de importancia** (ascendente): la tarea más crítica obtiene rank 1.
2. **Rank de dificultad inverso** (descendente): la tarea más difícil obtiene rank 1.

```
score = rank_importancia + rank_dificultad
```

Las tareas con menor score van primero. En caso de empate, desempata por importancia.

**Resultado:** siempre ganan las tareas que combinan alta importancia y alta dificultad. Es determinista: la misma entrada produce siempre el mismo resultado, independientemente de cualquier estado externo.

**Cuándo usarlo:** cuando quieres una priorización objetiva y reproducible, sin considerar el estado de energía o el contexto de la sesión.

---

## Comparación rápida

| | JumpingCat | BalancedFlow | PilaScore |
|---|---|---|---|
| **Lógica** | Reglas manuales por posición | Energía dinámica | Score matemático |
| **Consistencia** | Fija para las 3 primeras, bloque para el resto | Depende del orden elegido | Determinista |
| **Prioriza** | Victoria rápida + desafío temprano | Ritmo sostenible | Importancia × dificultad |
| **Previsibilidad** | Baja | Media | Alta |
| **Mejor para** | Arrancar con motivación | Sesiones largas | Priorización objetiva |

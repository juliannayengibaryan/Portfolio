(() => {
  const gridTargets = document.querySelectorAll(".editorial-home .board, #collection-root, .legal-content");
  if (!gridTargets.length) return;

  const readCssPixelValue = (name, fallback) => {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name);
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const findBalancedGrid = (width, height) => {
    const targetCell = readCssPixelValue("--grid-bg-size", 64);
    const targetPad = readCssPixelValue("--grid-bg-safe", 12);
    const columns = Math.max(2, Math.floor((width - targetPad * 2) / targetCell));
    const rows = Math.max(2, Math.floor((height - targetPad * 2) / targetCell));

    return {
      columns,
      rows,
      cell: targetCell,
      padX: (width - columns * targetCell) / 2,
      padY: (height - rows * targetCell) / 2
    };
  };

  const updateGridTarget = (target) => {
    const rect = target.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const { columns, rows, cell, padX, padY } = findBalancedGrid(rect.width, rect.height);
    let grid = target.querySelector(":scope > .board-grid");

    if (!grid) {
      grid = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      grid.classList.add("board-grid");
      grid.setAttribute("aria-hidden", "true");
      grid.setAttribute("focusable", "false");
      target.prepend(grid);
    }

    target.style.setProperty("--grid-cell", `${cell.toFixed(3)}px`);
    target.style.setProperty("--grid-pad-x", `${padX.toFixed(3)}px`);
    target.style.setProperty("--grid-pad-y", `${padY.toFixed(3)}px`);
    grid.setAttribute("viewBox", `0 0 ${rect.width.toFixed(3)} ${rect.height.toFixed(3)}`);
    grid.setAttribute("preserveAspectRatio", "none");
    grid.replaceChildren();

    const makeLine = (x1, y1, x2, y2) => {
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", x1.toFixed(3));
      line.setAttribute("y1", y1.toFixed(3));
      line.setAttribute("x2", x2.toFixed(3));
      line.setAttribute("y2", y2.toFixed(3));
      grid.append(line);
    };

    const right = padX + columns * cell;
    const bottom = padY + rows * cell;

    for (let column = 0; column <= columns; column += 1) {
      const x = padX + column * cell;
      makeLine(x, padY, x, bottom);
    }

    for (let row = 0; row <= rows; row += 1) {
      const y = padY + row * cell;
      makeLine(padX, y, right, y);
    }
  };

  const resizeGridObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => updateGridTarget(entry.target));
  });

  gridTargets.forEach((target) => {
    updateGridTarget(target);
    resizeGridObserver.observe(target);
  });

  window.addEventListener("load", () => {
    gridTargets.forEach(updateGridTarget);
  });
})();

// Veículo = bolinha pequena na cor do status/segmento
export function vehHtml(color) {
  return '<div style="width:12px;height:12px;border-radius:50%;background:' + color + ';border:2px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,.45),0 1px 3px rgba(0,0,0,.55);box-sizing:content-box"></div>';
}

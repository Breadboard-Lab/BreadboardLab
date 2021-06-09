import Block from './components/block.js';
import Gate from './components/gate.js';
import Circuit from './components/circuit.js';
import SegmentedWire from './components/segmented_wire.js';
// import svgExporter from './lib/saveSvgAsPng.js';

let lastDragX = 0;
let lastDragY = 0;
let initialPositionX = 0;
let initialPositionY = 0;
let dragging = false;

window.onload = function () {
  let diagram = document.getElementById('diagram');

  let circuit = new Circuit('circuit_sim', 'test_circuit', 'Test', 1000, 650);

  // initialize a circuit (for easier testing)
  let gate1 = new Gate('gate1', 'XOR');
  circuit.addGate(gate1);
  gate1.moveTo(600, 300);
  let gate1Input1 = gate1.inputs[0];
  let gate1Input2 = gate1.inputs[1];
  let gate1Output = gate1.outputs[0];

  let gate2 = new Gate('gate2', 'NOT');
  circuit.addGate(gate2);
  gate2.moveTo(300, 500);
  let gate2Input1 = gate2.inputs[0];
  let gate2Output = gate2.outputs[0];

  let input1 = circuit.addInput('S0');
  let input2 = circuit.addInput('S1');
  let output1 = circuit.addOutput('D0');
  // let output2 = circuit.addOutput('D1');
  circuit.layout();

  let gate1InputWire1 = new SegmentedWire(input1, gate1Input1);
  circuit.addWire(gate1InputWire1);

  let gate1OutputWire = new SegmentedWire(gate1Output, output1);
  circuit.addWire(gate1OutputWire);

  let gate2InputWire1 = new SegmentedWire(input2, gate2Input1);
  circuit.addWire(gate2InputWire1);

  let gate2OutputWire = new SegmentedWire(gate2Output, gate1Input2);
  circuit.addWire(gate2OutputWire);

  var id = 1;

  let exportAsSvg = document.getElementById('export_svg');
  exportAsSvg.onclick = function() {
    let svgExport = document.getElementById('export_content');
    svgExport.textContent = circuit.svg.outerHTML;
  };

  let exportAsPng = document.getElementById('export_png');
  exportAsPng.onclick = function() {
    var svgString = new XMLSerializer().serializeToString(document.querySelector('svg'));

    var canvas = document.getElementById("png_canvas");
    var ctx = canvas.getContext("2d");
    var DOMURL = self.URL || self.webkitURL || self;
    var img = new Image();
    var svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
    var url = DOMURL.createObjectURL(svg);
    img.onload = function() {
        ctx.drawImage(img, 0, 0);
        var png = canvas.toDataURL("image/png");
        document.querySelector('#export_content').innerHTML = '<img src="'+png+'"/>';
        DOMURL.revokeObjectURL(png);
    };
    img.src = url;
  };


  let notGateToolbarItem  = document.getElementById('not_gate');
  notGateToolbarItem.onclick = function() {
    let newNot = new Gate(`not${id++}`, 'NOT');
    circuit.placeNewGate(newNot);
  };

  let orGateToolbarItem   = document.getElementById('or_gate');
  orGateToolbarItem.onclick = function() {
    let newOr = new Gate(`or${id++}`, 'OR');
    circuit.placeNewGate(newOr);
  };

  let andGateToolbarItem  = document.getElementById('and_gate');
  andGateToolbarItem.onclick = function() {
    let newAnd = new Gate(`and${id++}`, 'AND');
    circuit.placeNewGate(newAnd);
  };

  let nandGateToolbarItem = document.getElementById('nand_gate');
  nandGateToolbarItem.onclick = function() {
    let newNand = new Gate(`nand${id++}`, 'NAND');
    circuit.placeNewGate(newNand);
  };

  let norGateToolbarItem  = document.getElementById('nor_gate');
  norGateToolbarItem.onclick = function() {
    let newNor = new Gate(`nor${id++}`, 'NOR');
    circuit.placeNewGate(newNor);
  };

  let xorGateToolbarItem  = document.getElementById('xor_gate');
  xorGateToolbarItem.onclick = function() {
    let newXor = new Gate(`xor${id++}`, 'XOR');
    circuit.placeNewGate(newXor);
  };

  let wireToolbarItem  = document.getElementById('wire');
  wireToolbarItem.onclick = function() {
    circuit.placeNewWire();
  };

  let inputToolbarItem  = document.getElementById('input');
  inputToolbarItem.onclick = function() {
    circuit.placeNewInput();
  };

  let outputToolbarItem  = document.getElementById('output');
  outputToolbarItem.onclick = function() {
    circuit.placeNewOutput();
  };
};
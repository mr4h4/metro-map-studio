/* Hidden legacy DOM: the fields the kernel reads/writes directly.
 * Rendered once, never re-rendered (all props static), kept invisible so the
 * kernel's own show/hide calls can never flash anything on screen. */

function range(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i + 1);
}

export default function LegacyBridge() {
  return (
    <div aria-hidden="true" style={{ display: 'none' }}>
      <div id="moocowwowyay" />
      <form id="myform" name="myform">
        <select name="List1" id="aaqq" size={6} defaultValue="ROUTE 1">
          <option id="option1" value="ROUTE 1">
            ROUTE 1
          </option>
          <option id="option2" value="ROUTE 2">ROUTE 2</option>
        </select>
        <input id="nambox" name="nambox" defaultValue="" />
        <input id="colbox" name="colbox" className="color {pickerPosition:'right'}" defaultValue="" />
        <input id="widbox" name="widbox" defaultValue="" />
        <input id="blar1" type="radio" name="modeqq" value="draw" defaultChecked />
        <input id="blar2" type="radio" name="modeqq" value="draw" defaultChecked />
        <input id="blar3" type="radio" name="modeqq" value="draw" defaultChecked />
        <input id="blar4" type="radio" name="modeqq" value="draw" defaultChecked />
      </form>
      <form name="frm3">
        {range(8).map((v) => (
          <input key={v} type="radio" name="qk" value={String(v)} defaultChecked={v === 1} />
        ))}
        {range(7).map((v) => (
          <input key={v} type="radio" name="qkk" value={String(v)} defaultChecked={v === 1} />
        ))}
      </form>
      <form name="frm2">
        <textarea id="ttxt2" name="txt2" readOnly defaultValue="" />
      </form>
      <div id="saver" />
    </div>
  );
}

// # TRASHY LITTLE SUBROUTINES
/**
 * Trashy Little Subroutines – a collection of tiny, mostly housekeeping
 * utility functions that the Apollo Guidance Computer needed but that do not
 * belong to the core guidance algorithms (ignition, braking, approach, vertical,
 * etc.).  Each method mirrors the original AGC one‑liners found in
 * LUNAR_LANDING_GUIDANCE_EQUATIONS.agc around line 1375.
 */
class TrashyLittleSubroutines {
  /** ------------------------------------------------------------
   *  INTPRETX – Set X1 on the way to the interpreter.
   *  In the AGC this routine loads the target‑point coordinate X1 using the
   *  current WCHPHASE index and then transfers to the main interpreter entry.
   * ------------------------------------------------------------ */
  setX1(wphases, targetIndex) {
    // AGC:   INDEX  FIXLOC
    // AGC:   TS    X1
    // AGC:   TCF   INTPRET
    // Here we simply grab the X1 element from the target descriptor.
    const fixLoc = this._fixLocForPhase(wphases, targetIndex);
    // Simulate "TS X1" – store the selected coordinate in an instance field.
    this.x1 = fixLoc.x1;
    // "TCF INTPRET" – hand over to the interpreter (in real code this would
    // be a jump to the interpreter loop; we just return indicating done).
    return this;
  }

  /** ------------------------------------------------------------
   *  TDISPSET – Prepare the TTF/8 display.
   *  Scales the time‑to‑go value, switches banks, and stores the intermediate
   *  TREDES word for later display output.
   * ------------------------------------------------------------ */
  setTtfDisplay(ttf8, tScalInv) {
    // AGC:   CA    TTF/8
    // AGC:   EXTEND
    // AGC:   MP    TSCALINV
    // AGC:   DXCH  TTFDISP
    // AEBANK5 … bank switching (here we just toggle a flag).
    this.bank = "TCGFAPPR"; // emulate the bank change
    // Extend & scale (fixed‑point → floating point mock)
    const extended = ttf8; // AGC extend is a no‑op in JS
    const scaled = extended * tScalInv;
    // Store the intermediate TREDES word.
    this.tredeas = scaled;
    // Finally "TC Q" – store quotient (we just return the value).
    return scaled;
  }

  /** ------------------------------------------------------------
   *  1406P00 / 1406ALM – Alarm entry points for the TTF computation.
   *  They simply test the alarm word and jump to the generic ALARM handler.
   * ------------------------------------------------------------ */
  triggerTtfAlarm(alarmType) {
    // AGC:   TC    POODOO / TC ALARM / TCF RATESTOP
    // In modern code we just dispatch to the appropriate handler.
    const handlers = {
      POODOO: () => console.log("TTF alarm POODOO"),
      ALARM: () => console.log("TTF alarm generic ALARM"),
      RATESTOP: () => console.log("TTF rate‑stop"),
    };
    const handler = handlers[alarmType];
    if (handler) handler();
    else console.warn("Unknown TTF alarm type:", alarmType);
  }

  /** ------------------------------------------------------------
   *  FASTCHNG – Specialised “PHASCHNG” subroutine.
   *  Used when a fast re‑phasing manoeuvre is required.  It swaps the current
   *  bank (EBANK3) and loads a new phase name.
   * ------------------------------------------------------------ */
  fastPhaseChange(newPhaseName) {
    // AGC:   CA    EBANK3
    // AGC:   XCH   EBANK
    // AGC:   TS    PHSNAME3
    // AGC:   LXCH  EBANK
    // AGC:   EBANK = E2DPS
    // AGC:   TC    A
    this.ebank = "E2DPS"; // emulate bank write
    this.phaseName = newPhaseName; // remember the new phase
    console.log(`Phase changed fast to ${newPhaseName}`);
  }

  /** ------------------------------------------------------------
   *  Helper: determine the FIXLOC entry for a given WCHPHASE.
   * ------------------------------------------------------------ */
  _fixLocForPhase(wphases, idx) {
    // Very small mock – in the real AGC this would index into a table.
    // Here we just return a dummy object with an x1 field.
    return { x1: `targetX_${idx}` };
  }
}

// ---------------------------------------------------------------------------
// Example usage (commented out so the module can be imported without side‑effects):
// ---------------------------------------------------------------------------
// const utils = new TrashyLittleSubroutines();
// utils.setX1(2, 0);               // → sets this.x1
// utils.setTtfDisplay(1234, 0.001); // → returns scaled TTF value
// utils.triggerTtfAlarm('ALARM');   // → logs alarm
// utils.fastPhaseChange('APPRQUAD'); // → changes bank & phase name

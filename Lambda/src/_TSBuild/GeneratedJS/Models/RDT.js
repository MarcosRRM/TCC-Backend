"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RDTArrayFromRows = exports.RDTFromRow = exports.RDT = void 0;
class RDT {
    constructor(id, tittle, dateTime, situation, autoThoughts, emotion, response, outcome) {
        this.ID = id;
        this.Tittle = tittle;
        this.DateTime = dateTime;
        this.Situation = situation;
        this.AutoThoughts = autoThoughts;
        this.Emotion = emotion;
        this.Response = response;
        this.Outcome = outcome;
    }
}
exports.RDT = RDT;
function RDTFromRow(row) {
    return new RDT(row.id, row.tittle, new Date(row.datetime), row.situation, row.auto_thoughts, row.emotion, row.response, row.outcome);
}
exports.RDTFromRow = RDTFromRow;
function RDTArrayFromRows(rows) {
    return rows.map((row) => RDTFromRow(row));
}
exports.RDTArrayFromRows = RDTArrayFromRows;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HTTPUtils_1 = require("../Utils/HTTPUtils");
const RDT_1 = require("../Models/RDT");
const pg_1 = require("pg");
const ConnPool = new pg_1.Pool({
    max: 5,
    connectionTimeoutMillis: 5000
});
exports.default = {
    RDTListAll: async function (event, context) {
        return ConnPool.query('SELECT * FROM "DiariesDB".rdt')
            .then((res) => {
            if (res.rowCount > 0) {
                return HTTPUtils_1.Return.Ok(RDT_1.RDTArrayFromRows(res.rows));
            }
            else {
                return HTTPUtils_1.Return.NoContent();
            }
        })
            .catch((err) => HTTPUtils_1.Return.Error(err));
    },
    RDTListByAuthor: function (event, context) {
        return ConnPool.query('SELECT * FROM "DiariesDB".rdt WHERE person_id = $1::numeric', [event.pathParameters.id])
            .then((res) => {
            if (res.rowCount > 0) {
                return HTTPUtils_1.Return.Ok(RDT_1.RDTArrayFromRows(res.rows));
            }
            else {
                return HTTPUtils_1.Return.NoContent();
            }
        })
            .catch((err) => {
            if (err.code === '22P02') {
                return HTTPUtils_1.Return.BadReq("Invalid Author");
            }
            else {
                return HTTPUtils_1.Return.Error(err);
            }
        });
    }
};

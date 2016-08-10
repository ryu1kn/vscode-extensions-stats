
const CsvWriter = require('../../lib/csv-writer');

describe('CsvWriter', () => {

    it('writes a header row', () => {
        const fs = {
            writeFile: sinon.stub().callsArgWith(3, null)
        };
        const header = [
            {id: 'FIELD_A', name: 'TITLE_A'},
            {id: 'FIELD_B', name: 'TITLE_B'}
        ];
        const writer = new CsvWriter({
            fs,
            filePath: 'FILE_PATH',
            header
        });

        return writer.writeHeader().then(() => {
            expect(fs.writeFile.args[0].slice(0, 3)).to.eql([
                'FILE_PATH',
                'TITLE_A,TITLE_B',
                {encoding: 'utf8'}
            ]);
        })
    });

    it('wraps a field value with double quotes if the field contains comma', () => {
        const fs = {
            writeFile: sinon.stub().callsArgWith(3, null)
        };
        const header = [
            {id: 'FIELD_A', name: 'TITLE,A'},
            {id: 'FIELD_B', name: 'TITLE_B'}
        ];
        const writer = new CsvWriter({
            fs,
            filePath: 'FILE_PATH',
            header
        });

        return writer.writeHeader().then(() => {
            expect(fs.writeFile.args[0].slice(0, 3)).to.eql([
                'FILE_PATH',
                '"TITLE,A",TITLE_B',
                {encoding: 'utf8'}
            ]);
        })
    });

    it('does not double quote or escape double quotes if it is used not on the edge of the string', () => {
        const fs = {
            writeFile: sinon.stub().callsArgWith(3, null)
        };
        const header = [
            {id: 'FIELD_A', name: 'TITLE"A'},
            {id: 'FIELD_B', name: 'TITLE_B'}
        ];
        const writer = new CsvWriter({
            fs,
            filePath: 'FILE_PATH',
            header
        });

        return writer.writeHeader().then(() => {
            expect(fs.writeFile.args[0].slice(0, 3)).to.eql([
                'FILE_PATH',
                'TITLE"A,TITLE_B',
                {encoding: 'utf8'}
            ]);
        })
    });

    it('escapes double quotes if it is used on the edge of the field value', () => {
        const fs = {
            writeFile: sinon.stub().callsArgWith(3, null)
        };
        const header = [
            {id: 'FIELD_A', name: '"TITLE_A'},
            {id: 'FIELD_B', name: 'TITLE_B'}
        ];
        const writer = new CsvWriter({
            fs,
            filePath: 'FILE_PATH',
            header
        });

        return writer.writeHeader().then(() => {
            expect(fs.writeFile.args[0].slice(0, 3)).to.eql([
                'FILE_PATH',
                '"""TITLE_A",TITLE_B',
                {encoding: 'utf8'}
            ]);
        })
    });

    it('writes a header row before it writes the first row', () => {
        const fs = {
            writeFile: sinon.stub().callsArgWith(3, null)
        };
        const header = [
            {id: 'FIELD_A', name: 'TITLE_A'},
            {id: 'FIELD_B', name: 'TITLE_B'}
        ];
        const writer = new CsvWriter({
            fs,
            filePath: 'FILE_PATH',
            header
        });

        const row = {
            FIELD_A: 'VALUE_A1',
            FIELD_B: 'VALUE_B1'
        };
        return writer.write(row).then(() => {
            expect(fs.writeFile.args[0].slice(0, 3)).to.eql([
                'FILE_PATH',
                'TITLE_A,TITLE_B',
                {encoding: 'utf8'}
            ]);
            expect(fs.writeFile.args[1].slice(0, 3)).to.eql([
                'FILE_PATH',
                'VALUE_A1,VALUE_B1',
                {
                    encoding: 'utf8',
                    flag: 'a'
                }
            ]);
        })
    });
});
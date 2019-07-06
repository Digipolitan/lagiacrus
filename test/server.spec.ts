import { expect } from 'chai';
import {Server} from '../src';

describe('the server', () => {

    let lagiacrus = undefined;

    beforeEach(() => {
        lagiacrus = new Server();
    });

    afterEach(async () => {
        await lagiacrus.close();
    });

    it('should listening', async () => {
        const http = await lagiacrus.start(process.env.PORT || 3000);
        expect(http.listening).to.equal(true);
    });
});
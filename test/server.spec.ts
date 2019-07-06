import {expect} from 'chai';
import {Server} from '../src';
import {HelloController} from './hello.controller';
import * as supertest from 'supertest';

const port = process.env.PORT || 8080;

describe('the server', () => {

    let lagiacrus: Server = undefined;

    beforeEach(async () => {
        lagiacrus = new Server();
    });

    afterEach(async () => {
        if(lagiacrus.isStarting) {
            await lagiacrus.close();
        }
    });

    it('should listen', async () => {
        const http = await lagiacrus.start(port);
        expect(http.listening).to.equal(true);
    });

    it('should mount controller only Lagiacrus controller', () => {
        expect(() => {
            lagiacrus.mount({
                '/user': function() { return 'random'; }
            });
        }).to.throw(TypeError);
    });

    it('should mount controller', () => {
        expect(() => {
            lagiacrus.mount(HelloController);
        }).to.not.throw(TypeError)
    });

    it('should handle request', async () => {
        lagiacrus.mount(HelloController);
        const server = await lagiacrus.start(port);
        const request = supertest(server);
        const res = await request.get('/hello');
        expect(res.status).to.equal(200);
        expect(res.text).to.equal('world');
    });
});
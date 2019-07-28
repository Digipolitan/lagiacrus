import {expect} from 'chai';
import {Server} from '../src';
import {HelloController} from './hello.controller';
import * as supertest from 'supertest';
import {SuperTest, Test} from 'supertest';

const port = process.env.PORT || 8080;

describe('the server', () => {

    let lagiacrus: Server;

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

    describe('Hello controller', () => {
        let request: SuperTest<Test>;

        beforeEach(async () => {
            lagiacrus.mount(HelloController);
            const server = await lagiacrus.start(port);
            request = supertest(server);
        });

        it('should handle request', async () => {
            const res = await request.get('/hello');
            expect(res.status).to.equal(200);
            expect(res.text).to.equal('world');
        });

        it('should retrieve query int parameter on controller',async () => {
            const res = await request.get('/hello/check?type=10');
            expect(res.status).to.equal(200);
            expect(res.text).to.equal('number');
        });

        it('should retrieve route params boolean on controller',async () => {
            const res = await request.get('/hello/check/yes');
            expect(res.status).to.equal(200);
            expect(res.text).to.equal('true');
        });

        it('should retrieve a 400 when the DTO didn\'t pass validation', async () => {
            const res = await request.post('/hello/create');
            expect(res.status).to.equal(400);
        });

        it('should parse the body as DTO class', async () => {
            const res = await request.post('/hello/create')
                .set('Content-Type', 'application/json')
                .send({
                    say: 'hello'
                });
            expect(res.status).to.equal(200);
            expect(res.text).to.equal('hello');
        });

        it('should retrieve the status code response when everything is right', async () => {
            const res = await request.put('/hello/update');
            expect(res.status).to.equal(204);
        });

        it('should retrieve another status code response when an error occurred', async () => {
            const res = await request.put('/hello/update?error=true');
            expect(res.status).to.equal(409);
        });
    });
});
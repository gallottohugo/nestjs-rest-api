import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { spec } from 'pactum';
import { AuthLoginDto, AuthSignupDto } from 'src/auth/dto';

describe('Application e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const serverPort = 5555;
  const baseUrl = 'http://localhost:5555/api/v1';

  beforeAll(async () => {
    const appModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = appModule.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.setGlobalPrefix('/api/v1');
    await app.init();
    await app.listen(serverPort);

    prisma = app.get(PrismaService);
    await prisma.cleanDB();

    // setBaseUrl does not work
    //pactum.request.setBaseUrl(`http://localhost:${serverPort}/api/v1`);
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    describe('Signup', () => {
      it('Should Signup', async () => {
        const reqBody: AuthSignupDto = {
          email: 'gallottohugo@gmail.com',
          password: 'test1234',
          username: 'gallottohugo',
          firstName: 'Hugo',
          lastName: 'Gallotto',
        };
        await spec()
          .post(`${baseUrl}/auth/signup`)
          .withBody(reqBody)
          .expectStatus(201);
      });

      it('Should fail if body is empty', async () => {
        await spec()
          .post(`${baseUrl}/auth/signup`)
          .withBody({})
          .expectStatus(400);
      });
    });

    describe('Login', () => {
      const reqBody: AuthLoginDto = {
        username: 'gallottohugo',
        password: 'test1234',
      };

      it('Should login', async () => {
        await spec()
          .post(`${baseUrl}/auth/login`)
          .withBody(reqBody)
          .expectStatus(200);
      });

      it('Should fail if username is empty', async () => {
        await spec()
          .post(`${baseUrl}/auth/login`)
          .withBody({ password: reqBody.password })
          .expectStatus(400);
      });

      it('Should fail if password is empty', async () => {
        await spec()
          .post(`${baseUrl}/auth/login`)
          .withBody({ username: reqBody.username })
          .expectStatus(400);
      });
    });
  });

  describe('User', () => {
    describe('Get Me', () => {
      it.todo('should ok');
    });

    describe('Edit User', () => {
      it.todo('should ok');
    });
  });

  describe('Boomarks', () => {
    describe('Create Bookmark', () => {
      it.todo('should ok');
    });

    describe('Get Bookmarks', () => {
      it.todo('should ok');
    });

    describe('Get Bookmark by id', () => {
      it.todo('should ok');
    });

    describe('Edit Bookmark by id', () => {
      it.todo('should ok');
    });

    describe('Delete Bookmark', () => {
      it.todo('should ok');
    });
  });
});

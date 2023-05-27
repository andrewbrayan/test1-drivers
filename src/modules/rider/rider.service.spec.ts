import { Test, TestingModule } from '@nestjs/testing';
import { RiderService } from './rider.service';
import { getModelToken } from '@nestjs/mongoose';

describe('RiderService', () => {
  let service: RiderService;
  let riderModelMock: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RiderService,
        {
          provide: getModelToken('Rider'),
          useValue: {
            find: jest.fn(),
            save: jest.fn(),
          },
        }
      ],
    }).compile();

    service = module.get<RiderService>(RiderService);
    riderModelMock = module.get(getModelToken('Rider'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createNewRider', () => {
    it('debe crear un nuevo pasajero si legal_id aún no está en uso', async () => {
      const riderParams = {
        full_name: "Brayan Andres",
        customer_email: "Andres.Brayan.M@gmail.com",
        legal_id: "1031160417",
        ledal_id_type: "CC"
      };

      riderModelMock.find.mockResolvedValue([]);
      riderModelMock.save.mockResolvedValue(riderParams);

      const result = await service.createNewRider(riderParams);

      expect(riderModelMock.find).toHaveBeenCalledWith({ legal_id: '1031160418' });
      expect(riderModelMock.save).toHaveBeenCalledWith(riderParams);
      expect(result).toEqual({
        statusCode: 200,
        status: 'Created',
        message: 'Usuario creado',
        data: riderParams,
      });
    });

    it('debería devolver una respuesta de conflicto si legal_id ya está en uso', async () => {
      const riderParams = {
        full_name: "Brayan Andres",
        customer_email: "Andres.Brayan.M@gmail.com",
        legal_id: "1031160418",
        ledal_id_type: "CC"
      };

      // Mocking the find function to return an array with a matching rider
      riderModelMock.find.mockResolvedValue([{ legal_id: '1031160418' }]);

      const result = await service.createNewRider(riderParams);

      expect(riderModelMock.find).toHaveBeenCalledWith({ legal_id: '1031160418' });
      expect(riderModelMock.save).not.toHaveBeenCalled();
      expect(result).toEqual({
        statusCode: 409,
        status: 'Conflict',
        message: 'El usuario 1031160418 ya está en uso',
        data: null,
      });
    });

    // it('should return a bad request response if there is an error creating the rider', async () => {
    //   const riderParams = {
    //     legal_id: '12345678',
    //   };

    //   // Mocking the find function to return an empty array
    //   riderModelMock.find.mockResolvedValue([]);

    //   // Mocking the save function to throw an error
    //   riderModelMock.save.mockRejectedValue(new Error('Error creating rider'));

    //   const result = await service.createNewRider(riderParams);

    //   expect(riderModelMock.find).toHaveBeenCalledWith({ legal_id: '12345678' });
    //   expect(riderModelMock.save).toHaveBeenCalledWith(riderParams);
    //   expect(result).toEqual({
    //     statusCode: 400,
    //     status: 'Bad Request',
    //     message: 'Error al crear el usuario',
    //     data: new Error('Error creating rider'),
    //   });
    // });
  });
});

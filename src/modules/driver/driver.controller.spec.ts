import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DriverService } from './driver.service';
import { Driver, DriverDocument } from './schemas/driver.schema';
import { CreateDriverDto } from './dto/create-driver.dto';
import { requestResponse } from 'src/shared/models/general.models';

describe('DriverService', () => {
  let driverService: DriverService;
  let driverModel: Model<DriverDocument>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DriverService,
        {
          provide: getModelToken(Driver.name),
          useValue: Model,
        },
      ],
    }).compile();

    driverService = moduleRef.get<DriverService>(DriverService);
    driverModel = moduleRef.get<Model<DriverDocument>>(getModelToken(Driver.name));
  });

  describe('createNewDriver', () => {
    it('should create a new driver', async () => {
      const createDriverDto: CreateDriverDto = {
        full_name: 'John Doe',
        customer_email: 'johndoe@example.com',
        legal_id: '1234567890',
        ledal_id_type: 'Type',
        current_location: [1.23, 4.56],
      };

      const saveSpy = jest.spyOn(driverModel.prototype, 'save').mockResolvedValueOnce(createDriverDto as any);
      const findSpy = jest.spyOn(driverModel, 'find').mockResolvedValueOnce([]);

      const result = await driverService.createNewDriver(createDriverDto);

      expect(findSpy).toHaveBeenCalledWith({ legal_id: createDriverDto.legal_id });
      expect(saveSpy).toHaveBeenCalled();
      expect(result.statusCode).toBe(200);
      expect(result.status).toBe('Created');
      expect(result.message).toBe('Conductor creado');
      expect(result.data).toBe(createDriverDto);
    });

    it('should return a conflict error if the legal ID already exists', async () => {
      const createDriverDto: CreateDriverDto = {
        full_name: 'John Doe',
        customer_email: 'johndoe@example.com',
        legal_id: '1234567890',
        ledal_id_type: 'Type',
        current_location: [1.23, 4.56],
      };

      const existingDriver: DriverDocument = {
        _id: 'existingId',
        full_name: 'Jane Smith',
        customer_email: 'janesmith@example.com',
        legal_id: '1234567890',
        ledal_id_type: 'Type',
        current_location: [7.89, 0.12],
      } as any;

      const findSpy = jest.spyOn(driverModel, 'find').mockResolvedValueOnce([existingDriver]);

      const result = await driverService.createNewDriver(createDriverDto);

      expect(findSpy).toHaveBeenCalledWith({ legal_id: createDriverDto.legal_id });
      expect(result.statusCode).toBe(409);
      expect(result.status).toBe('Conflict');
      expect(result.message).toBe(`El conductor ${existingDriver.legal_id} ya está en uso`);
      expect(result.data).toBeNull();
    });

    it('should return a bad request error if an error occurs while saving the driver', async () => {
      const createDriverDto: CreateDriverDto = {
        full_name: 'John Doe',
        customer_email: 'johndoe@example.com',
        legal_id: '1234567890',
        ledal_id_type: 'Type',
        current_location: [1.23, 4.56],
      };

      const error = new Error('Save error');
      const saveSpy = jest.spyOn(driverModel.prototype, 'save').mockRejectedValueOnce(error);

      const result = await driverService.createNewDriver(createDriverDto);

      expect(saveSpy).toHaveBeenCalled();
      expect(result.statusCode).toBe(400);
      expect(result.status).toBe('Bad Request');
      expect(result.message).toBe('Error al crear el conductor');
      expect(result.data).toBe(error);
    });
  });

  describe('getDrivers', () => {
    it('should return all drivers', async () => {
      const drivers: DriverDocument[] = [
        {
          _id: 'driver1',
          full_name: 'John Doe',
          customer_email: 'johndoe@example.com',
          legal_id: '1234567890',
          ledal_id_type: 'Type',
          current_location: [1.23, 4.56],
        } as any,
        {
          _id: 'driver2',
          full_name: 'Jane Smith',
          customer_email: 'janesmith@example.com',
          legal_id: '0987654321',
          ledal_id_type: 'Type',
          current_location: [7.89, 0.12],
        } as any,
      ];

      const findSpy = jest.spyOn(driverModel, 'find').mockResolvedValueOnce(drivers);

      const result = await driverService.getDrivers();

      expect(findSpy).toHaveBeenCalled();
      expect(result.statusCode).toBe(200);
      expect(result.status).toBe('Accepted');
      expect(result.message).toBe(`${drivers.length}, conductores encontrados`);
      expect(result.data).toBe(drivers);
    });

    it('should return a bad request error if no drivers exist', async () => {
      const findSpy = jest.spyOn(driverModel, 'find').mockResolvedValueOnce([]);

      const result = await driverService.getDrivers();

      expect(findSpy).toHaveBeenCalled();
      expect(result.statusCode).toBe(400);
      expect(result.status).toBe('Bad Request');
      expect(result.message).toBe('No existen conductores en el sistema');
      expect(result.data).toBeNull();
    });
  });

  describe('getDriver', () => {
    it('should return a specific driver', async () => {
      const driverId = 'driver1';
      const driver: DriverDocument = {
        _id: driverId,
        full_name: 'John Doe',
        customer_email: 'johndoe@example.com',
        legal_id: '1234567890',
        ledal_id_type: 'Type',
        current_location: [1.23, 4.56],
      } as any;

      const findOneSpy = jest.spyOn(driverModel, 'findOne').mockResolvedValueOnce(driver);

      const result = await driverService.getDriver(driverId);

      expect(findOneSpy).toHaveBeenCalledWith({ legal_id: driverId });
      expect(result.statusCode).toBe(200);
      expect(result.status).toBe('Accepted');
      expect(result.message).toBe(`${driver.full_name}, encontrado`);
      expect(result.data).toBe(driver);
    });

    it('should return a bad request error if the driver does not exist', async () => {
      const driverId = 'nonExistingDriver';
      const findOneSpy = jest.spyOn(driverModel, 'findOne').mockResolvedValueOnce(null);

      const result = await driverService.getDriver(driverId);

      expect(findOneSpy).toHaveBeenCalledWith({ legal_id: driverId });
      expect(result.statusCode).toBe(400);
      expect(result.status).toBe('Bad Request');
      expect(result.message).toBe('No existen este conductor en el sistema');
      expect(result.data).toBeNull();
    });
  });
});

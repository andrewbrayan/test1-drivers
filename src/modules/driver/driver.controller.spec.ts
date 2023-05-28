import { Test, TestingModule } from "@nestjs/testing";
import { CreateDriverDto } from "./dto/create-driver.dto";

import { DriverService } from "./driver.service";
import { DriverModule } from "./driver.module";

import { getModelToken } from "@nestjs/mongoose";
import { Driver, DriverDocument } from "./schemas/driver.schema";

describe("DriverService", () => {
  let service: DriverService;

  const mockDriver = {
    full_name: "Brayan Andres Martinez",
    customer_email: "andres.brayan.m@gmail.com",
    legal_id: "123456789",
    ledal_id_type: "CC",
    current_location: [0, 0],
    save: jest.fn().mockResolvedValue({})
  };
  
  // Define la función 'mockModel' como una función de constructor
  const mockModel = function() {
    return mockDriver;
  };
  
  mockModel.find = jest.fn().mockImplementation(() => {
    return Promise.resolve([mockDriver]);
  });
  
  mockModel.findOne = jest.fn().mockImplementation(() => {
    return Promise.resolve(mockDriver);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DriverModule],
    })
      .overrideProvider(getModelToken(Driver.name))
      .useValue(mockModel)
      .compile();

    service = module.get<DriverService>(DriverService);
  });

  describe("createNewDriver", () => {
    it("Debería crear un nuevo conductor", async () => {
      const createDriverDto: CreateDriverDto = {
        full_name: "Brayan Andres Martinez",
        customer_email: "andres.brayan.m@gmail.com",
        legal_id: "321654987",
        ledal_id_type: "CC",
        current_location: [0, 0],
      };

      const result = await service.createNewDriver(createDriverDto);

      expect(result.statusCode).toBe(200);
      expect(result.status).toBe("Created");
    });

    it("Debería fallar al intentar crear un conductor con un legal_id ya existente", async () => {

      const createDriverDto: CreateDriverDto = {
        full_name: "Brayan Andres Martinez",
        customer_email: "andres.brayan.m@gmail.com",
        legal_id: "123456789",
        ledal_id_type: "CC",
        current_location: [0, 0],
      };

      const result = await service.createNewDriver(createDriverDto);

      expect(result.statusCode).toBe(409);
      expect(result.status).toBe("Conflict");
      expect(result.data).toBeNull();
    });
  });

  describe("getDrivers", () => {
    it("Deberia retornar todos los conductores", async () => {
      const result = await service.getDrivers();

      expect(result.statusCode).toBe(200);
      expect(result.status).toBe("Accepted");
      expect(result.data[0]).toEqual(mockDriver);
    });
  });

  describe("getDriver", () => {
    it("Deberia retornar el conductor deseado, conductor con cedula 123456789", async () => {
      const driverLegalId = "123456789";
      const result = await service.getDriver(driverLegalId);

      expect(result.statusCode).toBe(200);
      expect(result.status).toBe("Accepted");
      expect(result.data.legal_id).toEqual(driverLegalId);
      expect(result.data).toEqual(mockDriver);
    });
  });
});

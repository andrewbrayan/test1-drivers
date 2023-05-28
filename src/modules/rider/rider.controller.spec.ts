import { Test, TestingModule } from "@nestjs/testing";
import { CreateRiderDto } from "./dto/create-rider.dto";

import { RiderService } from "./rider.service";
import { RiderModule } from "./rider.module";

import { getModelToken } from "@nestjs/mongoose";
import { Rider, RiderDocument } from "./schemas/rider.schema";

describe("RiderService", () => {
  let service: RiderService;

  const mockRider = {
    full_name: "Brayan Andres Martinez",
    customer_email: "andres.brayan.m@gmail.com",
    legal_id: "123456789",
    ledal_id_type: "CC",
    current_location: [0, 0],
    save: jest.fn().mockResolvedValue({})
  };
  
  // Define la función 'mockModel' como una función de constructor
  const mockModel = function() {
    return mockRider;
  };
  
  mockModel.find = jest.fn().mockImplementation(() => {
    return Promise.resolve([mockRider]);
  });
  
  mockModel.findOne = jest.fn().mockImplementation(() => {
    return Promise.resolve(mockRider);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RiderModule],
    })
      .overrideProvider(getModelToken(Rider.name))
      .useValue(mockModel)
      .compile();

    service = module.get<RiderService>(RiderService);
  });

  describe("createNewRider", () => {
    it("Debería crear un nuevo pasajero", async () => {
      const createRiderDto: CreateRiderDto = {
        full_name: "Brayan Andres Martinez",
        customer_email: "andres.brayan.m@gmail.com",
        legal_id: "321654987",
        ledal_id_type: "CC",
      };

      const result = await service.createNewRider(createRiderDto);

      expect(result.statusCode).toBe(200);
      expect(result.status).toBe("Created");
    });

    it("Debería fallar al intentar crear un pasajero con un legal_id ya existente", async () => {

      const createRiderDto: CreateRiderDto = {
        full_name: "Brayan Andres Martinez",
        customer_email: "andres.brayan.m@gmail.com",
        legal_id: "123456789",
        ledal_id_type: "CC"
      };

      const result = await service.createNewRider(createRiderDto);

      expect(result.statusCode).toBe(409);
      expect(result.status).toBe("Conflict");
      expect(result.data).toBeNull();
    });
  });

  describe("getRiders", () => {
    it("Deberia retornar todos los pasajeros", async () => {
      const result = await service.getRiders();

      expect(result.statusCode).toBe(200);
      expect(result.status).toBe("Accepted");
      expect(result.data[0]).toEqual(mockRider);
    });
  });

  describe("getRider", () => {
    it("Deberia retornar el pasajero deseado, pasajero con cedula 123456789", async () => {
      const riderLegalId = "123456789";
      const result = await service.getRider(riderLegalId);

      expect(result.statusCode).toBe(200);
      expect(result.status).toBe("Accepted");
      expect(result.data.legal_id).toEqual(riderLegalId);
      expect(result.data).toEqual(mockRider);
    });
  });
});

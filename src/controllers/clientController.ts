import { Request, Response } from 'express';
import { ClientService } from '../services/clientService';
import { ApiResponse } from '../types/database';
import { asyncHandler } from '../middleware/errorHandler';
import { createSupabaseClientWithAuth } from '../config/database';
import type { AuthenticatedRequest } from '../middleware/authMiddleware';

export class ClientController {
  private clientService: ClientService;

  constructor() {
    this.clientService = new ClientService();
  }

  getAllClients = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const { authToken } = req as AuthenticatedRequest;
    const service = authToken ? new ClientService(createSupabaseClientWithAuth(authToken)) : this.clientService;
    const clients = await service.getAllClients();
    res.status(200).json({
      success: true,
      data: clients,
      message: 'Clients retrieved successfully'
    });
  });

  getClientById = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const id = parseInt(req.params.id);
    const { authToken } = req as AuthenticatedRequest;
    const service = authToken ? new ClientService(createSupabaseClientWithAuth(authToken)) : this.clientService;
    const client = await service.getClientById(id);
    res.status(200).json({
      success: true,
      data: client,
      message: 'Client retrieved successfully'
    });
  });

  createClient = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const { authToken, user } = req as AuthenticatedRequest;
    const service = authToken ? new ClientService(createSupabaseClientWithAuth(authToken)) : this.clientService;
    const client = await service.createClient(req.body, user?.id);
    res.status(201).json({
      success: true,
      data: client,
      message: 'Client created successfully'
    });
  });

  updateClient = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const id = parseInt(req.params.id);
    const { authToken } = req as AuthenticatedRequest;
    const service = authToken ? new ClientService(createSupabaseClientWithAuth(authToken)) : this.clientService;
    const client = await service.updateClient(id, req.body);
    res.status(200).json({
      success: true,
      data: client,
      message: 'Client updated successfully'
    });
  });

  deleteClient = asyncHandler(async (req: Request, res: Response<ApiResponse<any>>) => {
    const id = parseInt(req.params.id);
    const { authToken } = req as AuthenticatedRequest;
    const service = authToken ? new ClientService(createSupabaseClientWithAuth(authToken)) : this.clientService;
    await service.deleteClient(id);
    res.status(200).json({
      success: true,
      message: 'Client deleted successfully'
    });
  });
}
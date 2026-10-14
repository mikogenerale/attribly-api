import { Controller, Get, Param, ParseUUIDPipe, Query, Req } from '@nestjs/common';
import { OrgRoles } from '@thallesp/nestjs-better-auth';
import { fromNodeHeaders } from 'better-auth/node';
import type { Request } from 'express';
import { StoreService } from './store.service.js';

// Requires an active organization on the session and membership in it.
// projectId (optional) selects one of the organization's GCP projects.
@Controller('stores')
@OrgRoles(['owner', 'admin', 'member'])
export class StoreController {
    constructor(private readonly storeService: StoreService) {}

    @Get()
    async getStores(
        @Req() req: Request,
        @Query('projectId', new ParseUUIDPipe({ optional: true })) projectId?: string,
    ) {
        return await this.storeService.getStores(fromNodeHeaders(req.headers), projectId);
    }

    @Get(':datasetId')
    async getStoreById(
        @Req() req: Request,
        @Param('datasetId') datasetId: string,
        @Query('projectId', new ParseUUIDPipe({ optional: true })) projectId?: string,
    ) {
        return await this.storeService.getStoreById(fromNodeHeaders(req.headers), datasetId, projectId);
    }

    @Get(':datasetId/tables')
    async getStoreTables(
        @Req() req: Request,
        @Param('datasetId') datasetId: string,
        @Query('projectId', new ParseUUIDPipe({ optional: true })) projectId?: string,
    ) {
        return await this.storeService.getStoreTables(fromNodeHeaders(req.headers), datasetId, projectId);
    }

    @Get(':datasetId/tables/:tableId')
    async getStoreTableData(
        @Req() req: Request,
        @Param('datasetId') datasetId: string,
        @Param('tableId') tableId: string,
        @Query('pageToken') pageToken?: string,
        @Query('projectId', new ParseUUIDPipe({ optional: true })) projectId?: string,
    ) {
        return await this.storeService.getStoreTableData(
            fromNodeHeaders(req.headers),
            datasetId,
            tableId,
            pageToken,
            projectId,
        );
    }
}

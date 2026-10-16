import { Controller, Get, Param, Req } from '@nestjs/common';
import { OrgRoles } from '@thallesp/nestjs-better-auth';
import { fromNodeHeaders } from 'better-auth/node';
import type { Request } from 'express';
import { StoreService } from './store.service.js';

// A store is a BigQuery dataset in the active organization's project.
// Requires an active organization on the session and membership in it.
@Controller('stores')
@OrgRoles(['owner', 'admin', 'member'])
export class StoreController {
    constructor(private readonly storeService: StoreService) {}

    @Get()
    async getStores(@Req() req: Request) {
        return await this.storeService.getStores(fromNodeHeaders(req.headers));
    }

    @Get(':storeId/performance')
    async getCombinedStoreAdsPerformance(
        @Req() req: Request,
        @Param('storeId') storeId: string,
    ) {
        return await this.storeService.getCombinedStoreAdsPerformance(fromNodeHeaders(req.headers), storeId);
    }
}

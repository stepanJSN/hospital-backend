import {
  Controller,
  Get,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  Patch,
  Delete,
  UseGuards,
  Param,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/auth/role.guard';
import { CurrentUser } from 'src/auth/decorators/user.decorator';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Public()
  @UsePipes(new ValidationPipe())
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Roles(Role.Admin)
  @UseGuards(RoleGuard)
  @Get()
  findAll(@Query() query: { firstName: string; lastName: string }) {
    return this.customersService.findAll(query.firstName, query.lastName);
  }

  @Roles(Role.Admin, Role.Customer, Role.Staff)
  @UseGuards(RoleGuard)
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const customer = await this.customersService.findOneById(id);

    if (!customer) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return customer;
  }

  @Roles(Role.Customer)
  @UseGuards(RoleGuard)
  @Patch('/current')
  update(
    @CurrentUser('uid') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Roles(Role.Customer, Role.Admin)
  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }
}

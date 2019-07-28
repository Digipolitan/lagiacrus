import {IsString, MinLength} from 'class-validator';

export class HelloCreateDTO {
    @IsString()
    @MinLength(2)
    say: string
}
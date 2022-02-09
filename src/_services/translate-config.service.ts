import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class TranslateConfigService {
    
    public lang;

    constructor(private translateService: TranslateService) { 
        if (localStorage.getItem('lang')  == "al"){
            this.translateService.use('al');
        }
        else{
            localStorage.setItem('lang', 'en');
            this.translateService.use('en');
        }
    }
    public changeLanguage(type: string){
        localStorage.setItem('lang', type);
        this.translateService.use(localStorage.getItem('lang'));
    }
}
import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'theme-component',
    templateUrl: './theme.template.html',
    styleUrls: ['./theme.component.less']
})
export class ThemeComponent implements OnInit {
    
    
    constructor() {
    }
    
    ngOnInit(): void {
    
    }
    
    updatePrimaryHueRangeAction(event: any) {
        const colorRange = event.target.value;
        document.documentElement.style.setProperty('--h-of-hsl-primary', colorRange)
    }
    
    updateSecondaryHueRangeAction(event: any) {
        const colorRange = event.target.value;
        document.documentElement.style.setProperty('--h-of-hsl-secondary', colorRange)
    }
    
}

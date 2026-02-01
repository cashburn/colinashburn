import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppConfigStore } from '@cashburn/core';
@Component({
    selector: 'app-shell',
    imports: [RouterOutlet],
    templateUrl: './shell.html',
    styleUrl: './shell.scss',
})
export class Shell {
    private readonly appConfigStore = inject(AppConfigStore);
    public readonly envName = this.appConfigStore.getConfigValue('environment');
}

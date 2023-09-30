import { Injectable, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';

@Injectable()
export class Unsubcriber implements OnDestroy {
    
    private _subcription : Subscription = new  Subscription();
 
    ngOnDestroy(): void {
        if(this._subcription){
            this._subcription.unsubscribe()
        }
    }

    protected restSubscription(){
        if(this._subcription){
            this._subcription.unsubscribe()
        }
    }

    
    addSubscription(sub : Subscription){
        this._subcription.add(sub)
    }

    set anotherSubscription(sub : Subscription){
        this._subcription.add(sub)
    }
}

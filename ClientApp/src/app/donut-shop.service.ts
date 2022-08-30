import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DonutShopService {

  constructor(private httpClient: HttpClient, @Inject('BASE_URL') newBaseUrl: string) {
    this.aspBaseUrl = newBaseUrl;
  }
  private aspBaseUrl: string = "";
  private readonly donutApiUrl: string = "https://grandcircusco.github.io/demo-apis/donuts.json";
  private readonly donutDetailUrl: string = "https://grandcircusco.github.io/demo-apis/donuts/";
  public readonly donutCart: Cart = new Cart();

  async getDonutList(): Promise<Donut[]> {
    let callResult: DonutApiResponse | any = null;
    try {
      callResult = await this.httpClient.get<DonutApiResponse>(this.donutApiUrl).toPromise();
      console.log('Service received ' + callResult.count.toString() + 'donuts.');
    }
    catch (unexpectedException) {
      callResult = [];
      callResult.results = [];
      if (unexpectedException instanceof HttpErrorResponse) {        let unexpectedExceptionHttp: HttpErrorResponse = unexpectedException;        console.log('Error sending http request ' + this.donutApiUrl + ': ' + unexpectedExceptionHttp.message);      }
    }
    return callResult.results;
  }

  async getDonutDetails(id: number): Promise<Donut> {
    let thisDonut: Donut | any = null;
    try {
      let donutString: string = this.donutDetailUrl;
      donutString = donutString + id + ".json";
      thisDonut = await this.httpClient.get<Donut>(donutString).toPromise();
      console.log('Donut details for donut #' + id + ' were successfully retrieved!');
    } catch (unexpectedException) {
      thisDonut = [];
      if (unexpectedException instanceof HttpErrorResponse) {        let unexpectedExceptionHttp: HttpErrorResponse = unexpectedException;        console.log('Cannot get donut #' + id + ': ' + unexpectedExceptionHttp.message);      }
    }
    return thisDonut;
  }

  public async addDonutToCart(id: number): Promise<void> {
    let donutToCart: Donut = await this.getDonutDetails(id);
    this.donutCart.items.push(donutToCart);
    console.log("donut added")
  }

  public removeFromCar(id: number): void {
    this.donutCart.items.splice(id, 1);
  }

  //public addDonutToCart(ourDonut: Donut) {
  //  this.donutCart.items.push(ourDonut);
  //  console.log("donut added");
  //}

  public showCart(): Donut[] {
    return this.donutCart.items;
  }

}

export class Donut {
  public id: number = 0;
  public ref: string = "";
  public name: string = "";
  public photo: string = "";
  public photo_attribution: string = "";
  public calories: number = 0;
  public extras: string[] = [];

}

export class DonutApiResponse {
  public count: number = 0;
  public result: Donut[] = [];
}

export class Cart {
  public items: Donut[] = [];

}

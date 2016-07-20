import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {Grocery} from "../../shared/grocery/grocery";
import {GroceryListService} from "../../shared/grocery/grocery-list.service";
import {TextField} from "ui/text-field";

var socialShare = require("nativescript-social-share");

@Component({
  selector: "list",
  templateUrl: "pages/list/list.html",
  styleUrls: ["pages/list/list-common.css", "pages/list/list.css"],
  providers: [GroceryListService]
})
export class ListPage implements OnInit {
  
  groceryList: Array<Grocery> = [];
  grocery: string = "";
  isLoading = false;
  listLoaded = false;
  @ViewChild("groceryTextField") groceryTextField: ElementRef;


  constructor(private _groceryListService: GroceryListService) {}
  
  ngOnInit() {
    this.isLoading = true;
    this._groceryListService.load()
      .subscribe(loadedGroceries => {
        loadedGroceries.forEach((groceryObject) => {
          this.groceryList.unshift(groceryObject);
        });
        this.isLoading = false;
        this.listLoaded = true;
      });
  }

  add() {
    if (this.grocery.trim() === "") {
      alert("Enter a grocery item");
      return;
    }

    // Dismiss the keyboard
    let textField = <TextField>this.groceryTextField.nativeElement;
    textField.dismissSoftInput();

    this._groceryListService.add(this.grocery)
      .subscribe(
        groceryObject => {
          this.groceryList.unshift(groceryObject);
          this.grocery = "";
        },
        () => {
          alert({
            message: "An error occurred while adding an item to your list.",
            okButtonText: "OK"
          });
          this.grocery = "";
        }
      )
  }
  
  delete(itemId: string) {


    this._groceryListService.delete(itemId)
      .subscribe(
        id => {
          var newGroceryList: Array<Grocery> = [];
          for(
            let i = 0, 
            size = this.groceryList.length; 
            i < size; 
            i++ 
          ){             
            if (this.groceryList[i].id === id) {
              this.groceryList.splice(i,1);
              
            }
          }
          
          alert({
            message: "Successfully Deleted.",
            okButtonText: "OK"
          });          
          
        },
        () => {
          alert({
            message: "An error occurred while deleting an item to your list.",
            okButtonText: "OK"
          });
          
        }
      )
  }
  
  share() {
    let list = [];
    for (let i = 0, size = this.groceryList.length; i < size ; i++) {
      list.push(this.groceryList[i].name);
    }
    let listString = list.join(", ").trim();
    socialShare.shareText(listString);
  }
  
}
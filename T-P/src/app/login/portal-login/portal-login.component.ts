import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from 'src/app/data.service';


@Component({
  selector: 'app-portal-login',
  templateUrl: './portal-login.component.html',
  styleUrls: ['./portal-login.component.css']
})
export class PortalLoginComponent implements OnInit {

  loginForm:FormGroup;
  loggedin=false;
  credentials:any;

  displayLogin :boolean;

  switch:boolean;

  email: string = "";
  password: string = "";

  loginPortal() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(4)])
    });
  }

  constructor(private router:Router,private cookieService:CookieService,private globalService:DataService) {
    localStorage.removeItem('token');
    this.loginPortal();
   }

 ngOnInit() {
    this.cookieService.deleteAll(); 
    console.log(this.display);
    
    // this.display();
  }

 onSubmit(data){
    this.email = data.email;
    this.password = data.password;
       
    this.cookieService.set('email',this.email);

  
    this.globalService.login(data).subscribe((res)=>{
      console.log(res.error);
      this.switch =!this.switch;
      if(res.message=='User not found'){
        alert('Usernot exist');
        return;
      }
      localStorage.setItem('token',res.token);
      if(res.role=='admin'){
        this.router.navigate(['admin-homepage/post-jobs'],{state:{email:this.email}});
      }
      else if(res.role=='interviewer'){
        this.router.navigate(['interviewer-homepage'],{state:{email:this.email}});
      }
      else if(res.role=='applicant'){
        this.router.navigate(['applicant-status'],{state:{email:this.email}});
      }
      this.globalService.onFirstComponentButtonClick();

    })

   
    
    this.loggedin=true;
    console.log(this.loggedin);
    this.loginForm.reset();

  }

  display(){
    this.displayLogin = !this.displayLogin;
  }
}
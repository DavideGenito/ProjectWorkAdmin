import { HttpInterceptorFn } from '@angular/common/http';
import { Injectable } from '@angular/core';



/*TODO: Aggiungere tutti gli import necessari*/
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (token) {
      const cloned = req.clone({
          headers: req.headers.set("Authorization",
              "Bearer " + token)
      });
      return next(cloned);  }
  else {
      return next(req);    
  }
};

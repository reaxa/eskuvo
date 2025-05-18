import { Injectable } from '@angular/core';
import { collection, collectionData, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { docData } from '@angular/fire/firestore';
import { Rendeles } from '../models/rendeles.model';
import { v4 as uuidv4 } from 'uuid'; 
import { Timestamp } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private firestore: Firestore) {}

  async sendOrder(order: Rendeles): Promise<void> {
    const orderId = order.id || uuidv4(); 
    const orderRef = doc(this.firestore, `Rendelesek/${orderId}`);
    const payload = {
      ...order,
      createdAt: order.createdAt instanceof Date ? Timestamp.fromDate(order.createdAt) : order.createdAt
    };

    await setDoc(orderRef, payload);
  }
}

import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function RichText(props: any) {

    const handleChangeQuote = (content: any) => {
        let options = props.quote.options;
        options.find((op: any) => op === props.option).items.find((it: any) => it === props.item).description = content;
        props.setQuote({
            quote: props.quote.quote,
            options: options
        });
      };

    const handleChangeJob = (content: any) => {
        let items = props.job.items;
        items.find((it: any) => it === props.item).description = content;
        props.setJob({
            job: props.job.job,
            items: items
        });
      };

    const handleChangeInvoice = (content: any) => {
        let items = props.invoice.items;
        items.find((it: any) => it === props.item).description = content;
        props.setInvoice({
            invoice: props.invoice.invoice,
            items: items
        });
      };

    if (props.type === 'job') {
      return (
        <ReactQuill theme="snow" value={props.content} onChange={handleChangeJob} />
      );
    }

    if (props.type === 'invoice') {
      return (
        <ReactQuill theme="snow" value={props.content} onChange={handleChangeInvoice} />
      );
    }

    return (
        <ReactQuill theme="snow" value={props.content} onChange={handleChangeQuote} />
    );
  }
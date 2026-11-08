-- Replace topical/news-oriented categories with private-order classifications.
alter table public.posts drop constraint if exists posts_category_check;
update public.posts set category = 'GENERAL' where category = 'CURRENT AFFAIRS';
alter table public.posts add constraint posts_category_check
  check (category in ('GENERAL','DISCUSSION','DECLARATIONS'));

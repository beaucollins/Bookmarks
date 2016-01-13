//
//  SiteDetailLoader.m
//  Bookmarks
//
//  Created by Beau Collins on 1/11/16.
//  Copyright © 2016 Automattic. All rights reserved.
//

#import "SiteDetailLoader.h"
#import <HTMLReader/HTMLReader.h>
#import "NSString+MD5.h"
#import "DetailFinder.h"

@implementation SiteDetailLoader
RCT_EXPORT_MODULE()

+ (NSArray *)rssSelectors {
  return @[
    [self extractAttribute:@"href" fromSelector:@"link[rel~=\"alternate\"][type=\"application/rss+xml\"]"]
  ];
}

+ (NSArray *)iconSelectors {
  return @[
    [self extractAttribute:@"href" fromSelector:@"link[rel~=\"apple-touch-icon\"]"],
    [self extractAttribute:@"href" fromSelector:@"link[rel~=\"apple-touch-icon-precomposed\"]"]
  ];
}
+ (NSArray *)titleSelectors {
  return @[[self extractContentFromSelector:@"title"]];
}

+ (id<DetailExtractor>)extractAttribute:(NSString *) attribute fromSelector:(NSString *)selector {
  return [[DetailFinder alloc] initWithMatcher:^HTMLElement *(HTMLNode *node) {
    return [node firstNodeMatchingSelector:selector];
  } andExtractor:^NSString *(HTMLElement *node) {
    return (NSString *)[[node attributes] objectForKey:attribute];
  }];
}

+ (id<DetailExtractor>)extractContentFromSelector:(NSString *)selector {
  return [[DetailFinder alloc] initWithMatcher:^HTMLElement *(HTMLNode *node) {
    return [node firstNodeMatchingSelector:selector];
  } andExtractor:^NSString *(HTMLElement *node) {
    return node.textContent;
  }];
}

+ (NSString *)extractDetailFromNode:(HTMLNode *)node usingExtractors:(NSArray *)extractors {
  return [self extractDetailFromNode:node usingExtractors:extractors withDefault:@""];
}

+ (NSString *)extractDetailFromNode:(HTMLNode *)node usingExtractors:(NSArray *)extractors withDefault:(NSString *)fallback {
  NSString *detail;
  for (id<DetailExtractor> extractor in extractors) {
    detail = [extractor extractDetailFromNode:node];
    if (detail != nil) {
      return detail;
    }
  }
  return fallback;
}

+ (NSString *)findIconURL:(HTMLNode *)node {
  return [self extractDetailFromNode:node usingExtractors:self.iconSelectors];
}

+ (NSString *)findRSSURL:(HTMLNode *)node {
  return [self extractDetailFromNode:node usingExtractors:self.rssSelectors];
}

+ (NSString *)findTitle:(HTMLNode *)node {
  return [self extractDetailFromNode:node usingExtractors:self.titleSelectors withDefault:@"Untitled"];
}

+ (NSString *)findRSSIcon:(HTMLNode *)node {
  return [self extractDetailFromNode:node usingExtractors:@[[self extractContentFromSelector:@"channel > image > url"]] withDefault:nil];
}

RCT_EXPORT_METHOD(requestSiteDetails:(NSURL *)url callback:(RCTResponseSenderBlock)callback) {
  NSURLSession *session = [NSURLSession sharedSession];
  [[session dataTaskWithRequest:[NSURLRequest requestWithURL:url] completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
    // Load the document
    NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *) response;
    HTMLDocument *document = [HTMLDocument documentWithData:data contentTypeHeader:[[httpResponse allHeaderFields] objectForKey:@"Content-Type"]];

    NSString __block *iconURL = [SiteDetailLoader findIconURL:document];
    NSString *rssURL = [SiteDetailLoader findRSSURL:document];
    NSString *title = [SiteDetailLoader findTitle:document];

    if (rssURL != nil) {
      [[session dataTaskWithRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:rssURL]] completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *)response;
        HTMLDocument *rssDocument = [HTMLDocument documentWithData:data contentTypeHeader: [httpResponse.allHeaderFields objectForKey:@"Content-Type"]];
        NSLog(@"RSS? %@ %@", [rssDocument firstNodeMatchingSelector:@"lastBuildDate"].textContent, url);
        
        NSString *rssIcon = [SiteDetailLoader findRSSIcon: rssDocument];
        NSArray *itemElements = [rssDocument nodesMatchingSelector:@"item"];
        NSMutableArray *items = [NSMutableArray arrayWithCapacity:itemElements.count];
        for (HTMLNode *node in itemElements) {
          [items addObject:@{
                             @"title": [[node firstNodeMatchingSelector:@"title"] textContent],
                             @"link": [[node firstNodeMatchingSelector:@"link"] textContent],
                             @"date": [[node firstNodeMatchingSelector:@"pubDate"] textContent],
                             @"guid": [[node firstNodeMatchingSelector:@"guid"] textContent]
                             }];
        }
        
        if (rssIcon != nil) {
          iconURL = rssIcon;
        }
        
        callback(@[[NSNull null], @{
                     @"title": title,
                     @"icon": iconURL,
                     @"rss": rssURL,
                     @"posts": items
                     }]);

      }] resume];
    } else {
      callback(@[[NSNull null], @{
                   @"title": title,
                   @"icon": iconURL,
                   @"rss": rssURL,
                   }]);
    }
    
    NSLog(@"Received response: %@ %@", url, title);
  }] resume];
  
}

@end
